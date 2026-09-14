<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;

class PublicSettingsController extends Controller
{
    public function index()
    {
        return response()->json(Setting::publicValues());
    }
}
