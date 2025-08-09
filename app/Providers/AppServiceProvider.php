<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // force https in production so asset() / url() produce https links
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

        // ... existing boot code
    }
}
