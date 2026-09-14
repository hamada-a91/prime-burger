<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    private function editableKeys(): array
    {
        return array_merge(Setting::PUBLIC_KEYS, Setting::PRIVATE_KEYS);
    }

    public function index()
    {
        return response()->json(
            Setting::whereIn('key', $this->editableKeys())->pluck('value', 'key')
        );
    }

    public function update(Request $request)
    {
        $data = collect($request->all())
            ->only($this->editableKeys())
            ->all();

        foreach ($data as $key => $value) {
            $group = 'general';
            if (str_starts_with($key, 'contact_')) {
                $group = 'contact';
            } elseif (str_starts_with($key, 'social_')) {
                $group = 'social';
            } elseif (in_array($key, ['hero_headline', 'hero_subline', 'about_story', 'about_philosophy', 'reservation_notice'])) {
                $group = 'texts';
            }

            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'group' => $group,
                    'type' => is_array($value) ? 'json' : 'string',
                ]
            );
        }

        return response()->json([
            'message' => __('messages.settings.saved'),
            'settings' => Setting::whereIn('key', $this->editableKeys())->pluck('value', 'key'),
        ]);
    }
}
