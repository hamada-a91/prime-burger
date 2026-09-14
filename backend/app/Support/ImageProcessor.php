<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

/**
 * Converts an uploaded/source image to WebP (max 1920px) plus a 480px thumbnail on the public disk.
 */
class ImageProcessor
{
    public const MAX_WIDTH = 1920;
    public const THUMB_WIDTH = 480;

    /**
     * @param  string|\Illuminate\Http\UploadedFile  $source
     * @return array{path: string, thumb_path: string, width: int, height: int}
     */
    public static function store(mixed $source, string $directory = 'gallery', ?string $basename = null): array
    {
        $manager = new ImageManager(new Driver());
        $filename = ($basename ?: uniqid()) . '_' . substr(md5((string) microtime(true)), 0, 6) . '.webp';

        $image = $manager->read($source);
        if ($image->width() > self::MAX_WIDTH) {
            $image->scale(width: self::MAX_WIDTH);
        }

        $path = "{$directory}/{$filename}";
        Storage::disk('public')->put($path, (string) $image->toWebp(84));

        $thumb = $manager->read($source)->scale(width: self::THUMB_WIDTH);
        $thumbPath = "{$directory}/thumbs/{$filename}";
        Storage::disk('public')->put($thumbPath, (string) $thumb->toWebp(78));

        return [
            'path' => $path,
            'thumb_path' => $thumbPath,
            'width' => $image->width(),
            'height' => $image->height(),
        ];
    }
}
