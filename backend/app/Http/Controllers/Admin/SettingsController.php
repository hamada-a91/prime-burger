<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        return response()->json(Setting::all()->pluck('value', 'key'));
    }

    public function update(Request $request)
    {
        $request->validate(['*' => ['nullable']]);

        $data = collect($request->all())
            ->only(Setting::PUBLIC_KEYS)
            ->all();

        foreach ($data as $key => $value) {
            $group = 'general';
            if (str_starts_with($key, 'contact_')) $group = 'contact';
            if (str_starts_with($key, 'social_')) $group = 'social';

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
            'settings' => Setting::all()->pluck('value', 'key'),
        ]);
    }
}
