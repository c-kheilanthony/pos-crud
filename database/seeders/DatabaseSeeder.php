<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\Customer::create([
            'name' => 'Ash',
            'address' => 'Pallet Town',
            'contact' => '09123456789',
            'email' => 'ash@example.com',
            'password' => bcrypt('pikachu'),
        ]);

        \App\Models\Cashier::create([
            'name' => 'Brock',
            'counter' => 'Counter 1',
            'email' => 'brock@example.com',
            'password' => bcrypt('onix'),
        ]);
    }

}
