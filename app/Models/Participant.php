<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $fillable = ['name', 'participant_id', 'program', 'grade', 'status', 'date', 'certificate'];
}