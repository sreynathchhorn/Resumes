<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function myApplications(Request $request){
        return response()->json(Application::with('job')->where('user_id',$request->user()->id)->latest()->get());
    }
    public function index(Request $request){
        abort_unless($request->user()?->role === 'admin',403);
        return response()->json(Application::with(['user','job'])->latest()->get());
    }
    public function store(Request $request){
        $user=$request->user();
        $request->merge(['job_id'=>(int)$request->input('job_id')]);
        $validated=$request->validate(['job_id'=>'required|integer|exists:job_postings,id','resume'=>'required|file|mimes:pdf|max:2048','cover_letter'=>'nullable|string|max:10000']);
        if(Application::where('user_id',$user->id)->where('job_id',$validated['job_id'])->exists()) return response()->json(['message'=>'You have already applied for this job.'],422);
        $path=$request->file('resume')->store('resumes','public');
        $application=Application::create(['user_id'=>$user->id,'job_id'=>$validated['job_id'],'resume'=>$path,'cover_letter'=>$validated['cover_letter']??null,'status'=>'applied']);
        ActivityLog::create(['user_id'=>$user->id,'action'=>'application_submitted','description'=>'Applied for job #'.$application->job_id,'ip_address'=>$request->ip()]);
        return response()->json($application->load('job'),201);
    }
    public function updateStatus(Request $request,$id){
        abort_unless($request->user()?->role === 'admin',403);
        $validated=$request->validate(['status'=>'required|string|in:pending,applied,under_review,shortlisted,interview,accepted,rejected']);
        $application=Application::findOrFail($id);$application->update(['status'=>$validated['status']]);
        ActivityLog::create(['user_id'=>$request->user()->id,'action'=>'application_status_changed','description'=>'Changed application #'.$application->id.' to '.$application->status,'ip_address'=>$request->ip()]);
        return response()->json($application);
    }
    public function downloadResume(Request $request,$id){
        $application=Application::findOrFail($id);
        abort_unless($request->user()->role === 'admin' || $request->user()->id === $application->user_id,403);
        $filePath=storage_path('app/public/'.$application->resume);
        if(!file_exists($filePath)) return response()->json(['message'=>'File not found.'],404);
        return response()->download($filePath);
    }
}
