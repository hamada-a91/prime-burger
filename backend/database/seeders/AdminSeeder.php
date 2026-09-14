<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@example.com');
        $password = env('ADMIN_PASSWORD');
        $name = env('ADMIN_NAME', 'Admin');

        if (! $password && app()->isProduction()) {
            throw new RuntimeException('ADMIN_PASSWORD muss in Production gesetzt sein.');
        }

        $attributes = [
            'name' => $name,
            'password' => Hash::make($password ?: 'password'),
        ];

        if (app()->environment(['local', 'testing'])) {
            User::updateOrCreate(['email' => $email], $attributes);

            return;
        }

        User::firstOrCreate(['email' => $email], $attributes);
    }
}
