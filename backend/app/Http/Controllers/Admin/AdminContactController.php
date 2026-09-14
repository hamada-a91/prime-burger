<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;

class AdminContactController extends Controller
{
    public function index()
    {
        return ContactSubmission::orderBy('created_at', 'desc')->paginate(20);
    }

    public function updateStatus(Request $request, $id)
    {
        $submission = ContactSubmission::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:new,read,replied,archived'
        ]);

        $submission->update($validated);
        return $submission;
    }
}
