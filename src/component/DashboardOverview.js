import React, { useState } from 'react';
import {
  BarChart2,
  ClipboardList,
  Calendar,
  Users,
  Gavel,
  ChevronDown,
  LogOut,
  Menu,
  UserCircle,
  Briefcase,
  FileText,
} from 'lucide-react';
// import DashboardCard from './DashboardCard';

const DashboardOverview = () => {
    // Statistics data (Mock)
    const stats = [
        { title: 'एकूण प्रलंबित खटले (Total Pending Cases)', value: '1,452', icon: <Briefcase size={28} />, bgColor: 'bg-indigo-600', textColor: 'white' },
        { title: 'आज दाखल झालेले नवीन खटले (New Cases Filed Today)', value: '17', icon: <FileText size={28} />, bgColor: 'bg-teal-600', textColor: 'white' },
        { title: 'पुढील ७ दिवसांतील सुनावण्या (Hearings in Next 7 Days)', value: '89', icon: <Calendar size={28} />, bgColor: 'bg-yellow-600', textColor: 'white' },
        { title: 'कर्मचारी उपस्थिती (Staff Attendance)', value: '92%', icon: <Users size={28} />, bgColor: 'bg-red-600', textColor: 'white' },
    ];
    
    const caseSplit = [
        { type: 'दिवाणी (Civil)', count: 580, color: '#3B82F6', percentage: '40%' },
        { type: 'फौजदारी (Criminal)', count: 872, color: '#EF4444', percentage: '60%' },
    ];

    return (
        <div className="space-y-8 p-4">
            
            {/* --- COURT IMAGE HERO SECTION --- */}
<div className="relative h-[40rem] w-full rounded-[2rem] overflow-hidden shadow-2xl mb-8 group">                {/* Reference to court.jpg in the public folder */}
                <img 
                    src="/court.jpeg" 
                    alt="Court Building" 
                    className="w-full h-full object-cover"
                />
                {/* Dark Gradient Overlay for readability */}
                {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8 md:px-12">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                        न्यायालय व्यवस्थापन प्रणाली
                    </h2>
                    <p className="text-teal-300 text-lg md:text-xl font-medium">
                        Court Management System Dashboard
                    </p>
                    <div className="mt-4 flex items-center space-x-2 text-white/80">
                        <Gavel size={20} />
                        <span className="text-sm">न्याय आणि समानता</span>
                    </div>
                </div> */}
            </div>

          
 
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rest of your commented out sections can go here */}
            </div>
        </div>
    );
};

export default DashboardOverview;
