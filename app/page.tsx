'use client';

import { useState, useEffect } from 'react';
import { Student, Teacher, AccessCard, AccessGate } from '@/lib/campus-oop';
import { ShieldAlert, ShieldCheck, DoorOpen, DoorClosed, User as UserIcon, GraduationCap, Briefcase } from 'lucide-react';

export default function SimulatorPage() {
  // State for UI feedback
  const [gateMessage, setGateMessage] = useState<string>('System Ready. Please swipe a card.');
  const [gateStatus, setGateStatus] = useState<'Open' | 'Closed' | 'Alarm'>('Closed');
  const [actionMessage, setActionMessage] = useState<string>('');

  // Use state to hold our OOP instances so they can be accessed during render
  const [system, setSystem] = useState<{
    student: Student;
    teacher: Teacher;
    mainGate: AccessGate;
    facultyGate: AccessGate;
  } | null>(null);

  // Force re-render when we toggle card status
  const [, setTick] = useState(0);

  useEffect(() => {
    // Initialize OOP objects on mount
    const onGateStatusChange = (status: string, message: string) => {
      setGateStatus(status as 'Open' | 'Closed' | 'Alarm');
      setGateMessage(message);
    };

    // Create Cards
    const studentCard = new AccessCard('CARD-101', true, 'STU-001', 'Student');
    const teacherCard = new AccessCard('CARD-201', true, 'TCH-001', 'Teacher');

    // Create Users
    const student = new Student('Alice Smith', 'STU-001', 'Computer Science', studentCard, 'Sophomore', 'Software Engineering');
    const teacher = new Teacher('Dr. Bob Jones', 'TCH-001', 'Computer Science', teacherCard, 'Professor', 'Room 404');

    // Create Gates
    // Main Gate allows both Students and Teachers
    const mainGate = new AccessGate('GATE-MAIN', 'Campus Entrance', ['Student', 'Teacher'], onGateStatusChange);
    // Faculty Gate allows ONLY Teachers
    const facultyGate = new AccessGate('GATE-FACULTY', 'Faculty Lounge', ['Teacher'], onGateStatusChange);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSystem({ student, teacher, mainGate, facultyGate });
  }, []);

  if (!system) return <div className="p-8">Loading System...</div>;

  const { student, teacher, mainGate, facultyGate } = system;

  const handleSwipe = (user: Student | Teacher, gate: AccessGate) => {
    // Reset gate to closed before swiping
    gate.CloseGate();
    // Simulate swipe
    setTimeout(() => {
      user.SwipeCard(gate);
      
      // Auto-close gate after 3 seconds if it opened
      if (gate.GateStatus === 'Open') {
        setTimeout(() => {
          gate.CloseGate();
        }, 3000);
      }
    }, 500);
  };

  const toggleCardStatus = (user: Student | Teacher) => {
    if (user.Card.IsActive) {
      user.Card.DeactivateCard();
    } else {
      user.Card.ActivateCard();
    }
    setTick(t => t + 1);
  };

  const performRoleAction = (user: Student | Teacher) => {
    if (user instanceof Student) {
      setActionMessage(user.RegisterForClasses());
    } else if (user instanceof Teacher) {
      setActionMessage(user.AssignGrades());
    }
    setTimeout(() => setActionMessage(''), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Access Simulator</h1>
        <p className="text-slate-500">Test the OOP-based access control system by swiping cards at different gates.</p>
      </div>

      {/* Gate Status Display */}
      <div className={`p-6 rounded-2xl border-2 transition-colors duration-300 flex items-center gap-4
        ${gateStatus === 'Open' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
          gateStatus === 'Alarm' ? 'bg-red-50 border-red-200 text-red-800' : 
          'bg-slate-50 border-slate-200 text-slate-800'}`}>
        
        <div className="p-3 bg-white rounded-full shadow-sm">
          {gateStatus === 'Open' && <DoorOpen className="w-8 h-8 text-emerald-600" />}
          {gateStatus === 'Closed' && <DoorClosed className="w-8 h-8 text-slate-600" />}
          {gateStatus === 'Alarm' && <ShieldAlert className="w-8 h-8 text-red-600" />}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold uppercase tracking-wider text-opacity-80">
            Status: {gateStatus}
          </h2>
          <p className="text-lg">{gateMessage}</p>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-indigo-50 text-indigo-800 border border-indigo-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <ShieldCheck className="w-5 h-5" />
          {actionMessage}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Student Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{student.Name}</h3>
                <p className="text-sm text-slate-500">Role: Student | ID: {student.UserID}</p>
              </div>
            </div>
            <button 
              onClick={() => toggleCardStatus(student)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors
                ${student.Card.IsActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
            >
              Card: {student.Card.IsActive ? 'Active' : 'Inactive'}
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleSwipe(student, mainGate)}
                className="p-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex flex-col items-center gap-2"
              >
                <DoorOpen className="w-5 h-5 text-slate-400" />
                Swipe at Main Gate
              </button>
              <button 
                onClick={() => handleSwipe(student, facultyGate)}
                className="p-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex flex-col items-center gap-2"
              >
                <ShieldAlert className="w-5 h-5 text-slate-400" />
                Swipe at Faculty Gate
              </button>
            </div>
            <button 
              onClick={() => performRoleAction(student)}
              className="w-full p-3 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
            >
              Execute: RegisterForClasses()
            </button>
          </div>
        </div>

        {/* Teacher Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{teacher.Name}</h3>
                <p className="text-sm text-slate-500">Role: Teacher | ID: {teacher.UserID}</p>
              </div>
            </div>
            <button 
              onClick={() => toggleCardStatus(teacher)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors
                ${teacher.Card.IsActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
            >
              Card: {teacher.Card.IsActive ? 'Active' : 'Inactive'}
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleSwipe(teacher, mainGate)}
                className="p-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex flex-col items-center gap-2"
              >
                <DoorOpen className="w-5 h-5 text-slate-400" />
                Swipe at Main Gate
              </button>
              <button 
                onClick={() => handleSwipe(teacher, facultyGate)}
                className="p-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex flex-col items-center gap-2"
              >
                <DoorOpen className="w-5 h-5 text-slate-400" />
                Swipe at Faculty Gate
              </button>
            </div>
            <button 
              onClick={() => performRoleAction(teacher)}
              className="w-full p-3 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors"
            >
              Execute: AssignGrades()
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
