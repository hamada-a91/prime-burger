<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = strtolower((string) $request->header('X-Locale', ''));

        if (! in_array($locale, ['de', 'en'])) {
            $locale = $request->getPreferredLanguage(['de', 'en']) ?: config('app.locale');
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
