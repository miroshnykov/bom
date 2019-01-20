<?php
namespace Application\Assetic\View;

use AsseticBundle\View\ViewHelperStrategy;
use Assetic\Asset\AssetCollection;
use AsseticBundle\Service;
use Zend\View\Renderer\PhpRenderer;
use Assetic\Asset\AssetInterface;

class HashedViewHelperStrategy extends ViewHelperStrategy
{
    public function setupAsset(AssetInterface $asset)
    {
        if ($this->isDebug() && !$this->isCombine() && $asset instanceof AssetCollection) {
            // Move assets as single instance not as a collection
            foreach ($asset as $value) {
                /** @var AssetCollection $value */
                $path = $this->getBaseUrl() . $this->getBasePath() .  $value->getTargetPath();
                $this->append($path, $this->getHash($value));
            }
        } else {
            $path = $this->getBaseUrl() . $this->getBasePath() .  $asset->getTargetPath();
            $this->append($path, $this->getHash($asset));
        }
    }

    protected function append($path, $hash)
    {
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $extension = strtolower($extension);

        $path .= '?v=' . $hash;

        switch($extension)
        {
            case 'js':
                $this->appendScript($path);
                break;

            case 'css':
                $this->appendStylesheet($path);
                break;
        }
    }

    protected function getHash(AssetInterface $asset)
    {
        $hash = hash_init('sha1');

        hash_update($hash, $asset->getLastModified());

        if ($asset instanceof AssetCollectionInterface) {
            foreach ($asset as $i => $leaf) {
                $sourcePath = $leaf->getSourcePath();
                hash_update($hash, $sourcePath ?: $i);
            }
        }

        return substr(hash_final($hash), 0, 7);
    }
}
