<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Customers
        \App\Models\Customer::create([
            'name' => 'Ash Ketchum',
            'address' => 'Pallet Town',
            'contact' => '09123456789',
            'email' => 'ash@example.com',
            'password' => bcrypt('pikachu'),
        ]);

        \App\Models\Customer::create([
            'name' => 'Misty',
            'address' => 'Cerulean City',
            'contact' => '09198765432',
            'email' => 'misty@example.com',
            'password' => bcrypt('starmie'),
        ]);

        // Create Cashiers
        \App\Models\Cashier::create([
            'name' => 'Brock',
            'counter' => 'Counter 1',
            'email' => 'brock@example.com',
            'password' => bcrypt('onix'),
        ]);

        \App\Models\Cashier::create([
            'name' => 'Nurse Joy',
            'counter' => 'Counter 2',
            'email' => 'joy@example.com',
            'password' => bcrypt('chansey'),
        ]);

        // Create Items
        \App\Models\Item::insert([
            ['name' => 'Potion', 'price' => 100, 'stock' => 10],
            ['name' => 'Pokeball', 'price' => 200, 'stock' => 20],
            ['name' => 'Super Potion', 'price' => 300, 'stock' => 5],
            ['name' => 'Revive', 'price' => 1500, 'stock' => 3],
        ]);
    }
}
