<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait HasUniqueSlug
{
    protected function makeSlugUnique(string $slug, string $modelClass, ?int $ignoreId = null): string
    {
        /** @var class-string<Model> $modelClass */
        $baseSlug = Str::slug($slug) ?: Str::random(8);
        $candidate = $baseSlug;
        $suffix = 1;

        while ($modelClass::query()
            ->where('slug', $candidate)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists()) {
            $candidate = $baseSlug . '-' . $suffix;
            $suffix++;
        }

        return $candidate;
    }
}
