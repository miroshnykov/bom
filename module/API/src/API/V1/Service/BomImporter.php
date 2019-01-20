<?php
namespace API\V1\Service;

class BomImporter {
    private static $possibleDelimiters = array(',', ';', ' ', "\t", '-', '|');
    private static $possibleEnclosures = array('"', '\'');

    private $localFile;

    private $delimiter = ',';
    private $enclosure = '"';
    private $escape    = '\\';

    private $data    = null;
    private $headers = null;

    public function download($file) {
        $this->localFile = tmpfile();
        $inputStream = fopen($file, 'r');
        $len = stream_copy_to_stream($inputStream, $this->localFile);
        fclose($inputStream);

        fseek($this->localFile, 0);
    }

    public function detectFileProperties() {
        $lines = array();
        for ($i=0; $i < 20 && !feof($this->localFile); $i++) {
            $lines[] = fgets($this->localFile);
        }

        $this->guessEnclosure($lines);
        return $this->guessDelimiterAndEnclosure($lines);
    }

    public function process() {
        if(!$this->delimiter) {
            throw new \Exception('Can\'t parse without a delimiter');
        }

        $this->data = array();
        fseek($this->localFile, 0);
        while(
            ($this->data[] =
                fgetcsv(
                    $this->localFile,
                    0,
                    $this->delimiter,
                    $this->enclosure,
                    $this->escape)) !== FALSE);


        // Remove empty line
        $last = array_pop($this->data);
        if(is_array($last)) {
            foreach ($last as $value) {
                if(!empty($value)) {
                    $this->data[] = $last;
                    break;
                }
            }
        }

        if(count($this->data) && $this->detectHeaders()) {
            $columnCount = count($this->headers);
            foreach ($this->data as &$item) {
                // Enforce the right count of columns
                $itemCount = count($item);
                if($itemCount === $columnCount) {
                    continue;
                } else if($itemCount < $columnCount) {
                    for ($i=0; $i < ($columnCount - $itemCount); $i++) {
                        $item[] = "";
                    }
                } else {
                    $item = array_slice($item, 0, $columnCount);
                }
            }
        }
    }

    public function getDelimiter() {
        return $this->delimiter;
    }

    public function getHeaders() {
        return $this->headers;
    }

    public function getData() {
        return $this->data;
    }

    private function detectHeaders() {
        // Remove trailing empty strings
        $filtered = array_filter($this->data[0]);
        if($filtered != array_slice($this->data[0], 0, count($filtered))) {
            $this->headers = null;
            return false;
        }

        if(count(array_filter($filtered, function($item) {
            return is_numeric($item);
        }))) {
            $this->headers = null;
            return false;
        }

        $this->data = array_slice($this->data, 1);
        $this->headers = $filtered;
        return true;
    }

    private function guessEnclosure($lines) {
        $countDouble = 0;
        $countSingle = 0;
        foreach ($lines as $line) {
            $countDouble += preg_match_all('/"/',  $line);
            $countSingle += preg_match_all('/\'/', $line);
        }

        if($countSingle > 0 && $countSingle > $countDouble) {
            $this->enclosure = '\'';
        }
    }

    private function guessDelimiterAndEnclosure($lines) {
        $noQuotes = array();
        foreach ($lines as $line) {
            // TODO modify the regex to account for escaped characters
            $noQuotes[] =
                preg_replace(
                    "/{$this->enclosure}[^{$this->enclosure}]*{$this->enclosure}/",
                    '',
                    $line);
        }

        // Matrix with the (counts per line) x (lines)
        $delimiters = array();
        foreach (BomImporter::$possibleDelimiters as $delimiter) {
            $delimiters[$delimiter] = array();
            foreach ($noQuotes as $line) {
                $delimiters[$delimiter][] = $this->checkDelimiter($line, $delimiter);
            }
        }

        return $this->rankDelimiters($delimiters);
    }

    private function rankDelimiters($delimiters) {
        $bestDelimiterScore = 0;
        $secondBest = 0;
        $this->delimiter = null;
        foreach ($delimiters as $key => $delimiter) {
            $avg = array_sum($delimiter) / 20;

            // The mode is a bit harder, since we need to sort and then count
            $sorted = $delimiter;
            sort($sorted);
            $best = $bestCount = $currentCount = $last = 0;
            foreach ($sorted as $current) {
                if($current === $last) {
                    $currentCount++;

                    if($currentCount > $bestCount) {
                        $bestCount = $currentCount;
                        $best = $current;
                    }
                } else {
                    $currentCount = 0;
                    $last = $current;
                }
            }

            $score = abs($best - $avg);
            if($score < 0.01) {
                // Cap to avoid divide by 0
                $score = 100;
            } else {
                $score = 1 / $score;
            }

            $score = sqrt($score) * $best;

            if($score > $bestDelimiterScore) {
                $this->delimiter = $key;
                $secondBest = $bestDelimiterScore;
                $bestDelimiterScore = $score;
            } else if($score > $secondBest) {
                $secondBest = $score;
            }
        }

        if($secondBest === 0) {
            $secondBest = 0.01;
        }

        if (($bestDelimiterScore / $secondBest) > 5 || $bestDelimiterScore < 0.01) {
            return true;
        }

        $this->delimiter = null;
        return false;
    }

    private function checkDelimiter($line, $char) {
        return array_reduce(str_split($line), function($carry, $item) use ($char) {
            if($item === $char) {
                $carry++;
            }

            return $carry;
        }, 0);
    }

    public function __destruct() {
        if($this->localFile) {
            fclose($this->localFile);
        }
    }
}
