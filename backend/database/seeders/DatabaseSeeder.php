<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin=User::factory()->create(['name'=>'Admin User','email'=>'admin@example.com','role'=>'admin','password'=>'password']);
        $candidate=User::factory()->create(['name'=>'Panhaboromey Em','email'=>'candidate@example.com','role'=>'candidate','password'=>'password']);
        User::factory()->create(['name'=>'Test User','email'=>'test@example.com','role'=>'candidate','password'=>'password']);

        DB::table('profiles')->insert([
            'user_id'=>$candidate->id,
            'title'=>'Information Technology Student',
            'bio'=>'Motivated IT student interested in software engineering, backend systems, and practical technology projects.',
            'phone'=>'+855 12 345 678',
            'location'=>'Phnom Penh, Cambodia',
            'skills'=>'C, Laravel, React, MySQL, Git, Microsoft Office',
            'experience'=>'Academic projects: built a dynamic resume and job application portal using React and Laravel.',
            'education'=>'Bachelor of Information Technology — Year 1',
            'portfolio_url'=>'https://github.com/',
            'created_at'=>now(),'updated_at'=>now(),
        ]);

        ActivityLog::insert([
            ['user_id'=>$candidate->id,'action'=>'registered','description'=>'Candidate account registered','created_at'=>now(),'updated_at'=>now()],
            ['user_id'=>$candidate->id,'action'=>'logged_in','description'=>'User logged in','created_at'=>now()->subHours(2),'updated_at'=>now()->subHours(2)],
            ['user_id'=>$admin->id,'action'=>'logged_in','description'=>'Admin logged in','created_at'=>now()->subHour(),'updated_at'=>now()->subHour()],
        ]);

        DB::table('job_postings')->insert([
            ['title'=>'Backend Developer (Intern)','company_name'=>'MNC Bank','description'=>'Assist the development team with Laravel APIs, database work, testing, and backend features.','location'=>'Phnom Penh, Cambodia','employment_type'=>'Internship','work_mode'=>'Remote','salary'=>'$300 - $500/mo','created_at'=>now(),'updated_at'=>now()],
            ['title'=>'IT Support Specialist','company_name'=>'TrueTech Solutions','description'=>'Provide technical support, troubleshoot hardware and software issues, and assist users with IT systems.','location'=>'Phnom Penh, Cambodia','employment_type'=>'Full-time','work_mode'=>'On-site','salary'=>'$400 - $700/mo','created_at'=>now(),'updated_at'=>now()],
            ['title'=>'Junior Software Engineer','company_name'=>'Amazon (Cambodia)','description'=>'Work with cross-functional teams to design, develop, test, and maintain web applications.','location'=>'Phnom Penh, Cambodia','employment_type'=>'Full-time','work_mode'=>'On-site','salary'=>'$600 - $900/mo','created_at'=>now(),'updated_at'=>now()],
            ['title'=>'Frontend Developer (Intern)','company_name'=>'GlobalTech Co.','description'=>'Build responsive web applications with React and collaborate with backend developers on API integration.','location'=>'Phnom Penh, Cambodia','employment_type'=>'Internship','work_mode'=>'Remote','salary'=>'$250 - $450/mo','created_at'=>now(),'updated_at'=>now()],
            ['title'=>'UX/UI Designer','company_name'=>'HealthTech Cambodia','description'=>'Design intuitive, user-centered experiences and collaborate with product teams to improve digital products.','location'=>'Phnom Penh, Cambodia','employment_type'=>'Internship','work_mode'=>'On-site','salary'=>'$250 - $450/mo','created_at'=>now(),'updated_at'=>now()],
            ['title'=>'Data Entry Assistant','company_name'=>'Khmer Digital Co., Ltd.','description'=>'Manage data entry, document preparation, and day-to-day operations support.','location'=>'Phnom Penh, Cambodia','employment_type'=>'Part-time','work_mode'=>'On-site','salary'=>'$200 - $350/mo','created_at'=>now(),'updated_at'=>now()],
        ]);
    }
}
