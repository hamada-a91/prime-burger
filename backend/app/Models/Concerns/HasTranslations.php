<?php

namespace App\Models\Concerns;

/**
 * Translatable attributes are stored as JSON objects keyed by locale: {"de": "...", "en": "..."}.
 */
trait HasTranslations
{
    public function translate(string $attribute, ?string $locale = null): ?string
    {
        $locale = $locale ?: app()->getLocale();
        $value = $this->getAttribute($attribute);

        if (! is_array($value)) {
            return $value;
        }

        return $value[$locale] ?? $value['de'] ?? (reset($value) ?: null);
    }
}
