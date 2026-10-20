<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;
    protected $table = 'job_postings';
    protected $fillable = ['title','description','company_name','location','employment_type','work_mode','salary'];
    public function applications(){ return $this->hasMany(Application::class); }
}
