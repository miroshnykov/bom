<?php

namespace API\V1\Rest\BomExport;

use API\V1\Rest\BaseService;
use Aws\Common\Aws;
use ZF\ApiProblem\ApiProblem;
use Aws\S3\S3Client;

use ZfcBase\EventManager\EventProvider;
use API\V1\Exception;
use Bom\Entity\Company;
use Bom\Entity\BomItemField;

class BomExportService extends BaseService {

    /**
     * @var Aws\S3\S3Client
     * s3 client
     */
    protected $s3;

    /**
     * @var string
     * s3 bucket name
     */
    protected $bucket;

    public function setCompanyToken($companyToken) {
        $this->getMapper('Bom\\Entity\\BomExport')->setCompanyToken($companyToken);
    }

    /**
     * Set Amazon S3 client and bucket
     */
    public function setS3($s3, $bucket) {
        $this->s3 = $s3;
        $this->bucket = $bucket;
    }

    public function save($data) {
        try {
            if (is_object($data)) {
                $data = get_object_vars($data);
            }

            // Make sure that attributes and itemIds are present
            if (!isset($data['attributes']) || !isset($data['itemIds']) ) {
                return new ApiProblem(404,"Missing arguments.");
            }

            // Get or create the entity
            if (isset($data->id) && $data->id) {
                // Savind existing entity is not supported at the moment, only creating new
                return new ApiProblem(422, 'Could not complete request.');
            } else {
                $entity = $this->getMapper('Bom\\Entity\\BomExport')->createEntity();

                $exportData = array();
                $exportData['status'] = 'processing';
                $exportData['message'] = '';
                $exportData['url'] = '';
                $entity->exchangeArray($exportData);
                $this->getMapper('Bom\\Entity\\BomExport')->save($entity);
            }

            if (isset($entity) && $entity) {
                // Generate CSV file and upload to Amazon S3
                // TODO this will need to move to a separate worker dyno
                $exportData = array();
                $exportData['status'] = 'ready';
                $exportData['message'] = '';
                $exportData['url'] = $this->processExportData($entity, $data);

                $entity->exchangeArray($exportData);
                $this->getMapper('Bom\\Entity\\BomExport')->save($entity);

                $response = $entity->getArrayCopy();

                if (extension_loaded('newrelic')) {
                    $msDuration = (microtime(true) - $_SERVER[REQUEST_TIME_FLOAT]) * 1000;
                    newrelic_custom_metric('Custom/Export/ExportDuration', $msDuration);
                    newrelic_record_custom_event("BomExport", array("duration"=>$msDuration));
                }

                return $response;
            } else {
                return new ApiProblem(404, 'Entity not found.');
            }

        } catch (\Exception $e) {
            return new ApiProblem(422, 'Could not complete request.');
        }
    }

    /**
     * @param array  $data
     * @return string url to file in amazon s3
     */
    public function processExportData($entity, $data) {
        // docs http://docs.aws.amazon.com/aws-sdk-php/guide/latest/service-s3.html

        // open temp file
        $fp = fopen('php://temp', 'w');
        if ($fp === FALSE) {
            throw new Exception('Failed to open temporary file');
        }

        // write CSV data to temp file
        $this->putCSV($fp, $data);
        rewind($fp);

        // generate file name
        // TODO datetime should match the user's timezone
        $fileName = 'export_bom_' . date('Y-m-d\THi') . '_' . $entity->id . '.csv';

        // copy file to amazon s3
        // this automatically closes the resource (which is a bit weird)
        $this->s3->putObject(array(
            'Bucket' => $this->bucket,
            'Key'    => $fileName,
            'Body'   => $fp
        ));

        return $this->s3->getObjectUrl($this->bucket, $fileName, '+10 minutes');
    }

    /**
     * Create CSV data from list of attributes and iters
     * @param array $data
     * @return string csv data
     */
    public function putCSV($fp, $data) {

        $attributesFieldId = array();
        $attributesName = array();
        $itemIds = array();

        // get attributes
        foreach ($data['attributes'] as $value) {
            $attributesFieldId[] = $value['fieldId'];
            $attributesName[] = $value['name'];
        }

        //get entity items,  itemIds is array
        $entItems = $this->getMapper('Bom\\Entity\\BomExport')->fetchItems($data['itemIds']);

        //Sorting the data
        $sortingArr = array();
        foreach ($data['itemIds'] as $key => $itemId) {
            $entItemKey = array_search(
                $itemId,
                array_map(function($item) { return $item->id; }, $entItems)
            );
            if ($entItemKey === false) { continue; }

            $entItem = $entItems[$entItemKey];

            foreach ($attributesFieldId as $fieldId) {
                $content = null;
                foreach ($entItem->bomItemFields as $value) {
                    if ($fieldId == $value->bomField->field->id) {
                        switch($value->bomField->field->id) {
                            case BomItemField::DNI:
                                $content = !!$value->content ? 'include' : 'DNI';
                                break;
                            case BomItemField::SMT:
                                $content = !!$value->content ? 'SMT' : 'TH';
                                break;
                            case BomItemField::SIDE:
                                $content = !!$value->content ? 'top' : 'bottom';
                                break;
                            case BomItemField::ROHS:
                                $content = !!$value->content ? 'yes' : 'no';
                                break;
                            default:
                                if ($value->bomField->field->isBool()) {
                                    $content = !!$value->content ? 'yes' : 'no';
                                }
                                else {
                                    $content = $value->content;
                                }
                                break;
                        }
                    }
                }

                if (is_null($content)) {
                    switch($fieldId) {
                        case BomItemField::DNI:
                            $content = 'include';
                            break;
                        case BomItemField::SMT:
                            $content = 'SMT';
                            break;
                        case BomItemField::SIDE:
                            $content = 'top';
                            break;
                        case BomItemField::ROHS:
                            $content = 'no';
                            break;
                        default:
                            if ($value->bomField->field->isBool()) {
                                $content = 'no';
                            }
                            else {
                                $content = '';
                            }
                            break;
                    }
                }

                $sortingArr[$key][$fieldId] = $content;
            }
        }

        //fill in the file
        fputcsv($fp, $attributesName);
        foreach ($sortingArr as $item) {
            fputcsv($fp, $item);
        }
    }
}
