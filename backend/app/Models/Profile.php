<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'bio',
        'skills',
        'experience',
        'education',
        'phone',
        'location',
        'portfolio_url',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
