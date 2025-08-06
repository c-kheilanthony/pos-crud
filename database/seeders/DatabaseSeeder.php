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
// Create Items
        \App\Models\Item::insert([
            ['name' => 'Ultra Ball', 'price' => 1200, 'stock' => 30],
            ['name' => 'Hyper Potion', 'price' => 1500, 'stock' => 10],
            ['name' => 'Full Restore', 'price' => 3000, 'stock' => 5],
            ['name' => 'Antidote', 'price' => 100, 'stock' => 20],
            ['name' => 'Paralyze Heal', 'price' => 200, 'stock' => 15],
            ['name' => 'Max Potion', 'price' => 2500, 'stock' => 8],
            ['name' => 'Escape Rope', 'price' => 500, 'stock' => 12],
            ['name' => 'Repel', 'price' => 350, 'stock' => 18],
            ['name' => 'X Attack', 'price' => 250, 'stock' => 25],
            ['name' => 'X Defense', 'price' => 250, 'stock' => 25],
        ]);
    }
}
