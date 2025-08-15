'use client';
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  Building, 
  FileText,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Globe,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [submittedEvents, setSubmittedEvents] = useState([]);
  const [events, setEvents] = useState({
    '2025-08-15': [
      { 
        id: 1, 
        title: 'Tech Conference 2025', 
        time: '10:00 AM', 
        location: 'Convention Center', 
        type: 'work',
        organizer: 'TechCorp Inc.',
        email: 'events@techcorp.com',
        description: 'Annual technology conference featuring the latest innovations'
      },
      { 
        id: 2, 
        title: 'Product Launch', 
        time: '2:30 PM', 
        location: 'Grand Ballroom', 
        type: 'meeting',
        organizer: 'StartupXYZ',
        email: 'launch@startupxyz.com',
        description: 'Launching our revolutionary new product'
      }
    ],
    '2025-08-20': [
      { 
        id: 3, 
        title: 'Networking Event', 
        time: '6:00 PM', 
        location: 'Business Hub', 
        type: 'work',
        organizer: 'Professional Network',
        email: 'connect@profnet.com',
        description: 'Monthly networking event for professionals'
      }
    ],
    '2025-08-25': [
      { 
        id: 4, 
        title: 'Workshop: AI & Future', 
        time: '1:00 PM', 
        location: 'Innovation Lab', 
        type: 'personal',
        organizer: 'Future Tech Academy',
        email: 'learn@futuretech.edu',
        description: 'Hands-on workshop exploring AI applications'
      }
    ]
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    location: '',
    type: 'work',
    name: '',
    email: '',
    organization: '',
    description: '',
    date: ''
  });

  const [animations, setAnimations] = useState({
    headerVisible: false,
    calendarVisible: false,
    formVisible: false
  });

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimations(prev => ({ ...prev, headerVisible: true })), 100);
    const timer2 = setTimeout(() => setAnimations(prev => ({ ...prev, calendarVisible: true })), 300);
    const timer3 = setTimeout(() => setAnimations(prev => ({ ...prev, formVisible: true })), 600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (day) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateKey);
    setShowEventModal(true);
  };

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.name.trim() || !newEvent.email.trim()) return;
    
    const eventWithId = {
      ...newEvent,
      id: Date.now(),
      organizer: newEvent.organization || newEvent.name
    };

    const dateKey = selectedDate || newEvent.date;
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), eventWithId]
    }));

    setSubmittedEvents(prev => [...prev, eventWithId]);
    setNewEvent({ 
      title: '', 
      time: '', 
      location: '', 
      type: 'work', 
      name: '', 
      email: '', 
      organization: '', 
      description: '', 
      date: '' 
    });
    setShowCreateModal(false);
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter(event => event.id !== eventId)
    }));
  };

  const getEventTypeColor = (type) => {
    const colors = {
      work: 'bg-gradient-to-r from-blue-500 to-blue-600',
      meeting: 'bg-gradient-to-r from-green-500 to-green-600',
      personal: 'bg-gradient-to-r from-purple-500 to-purple-600',
      deadline: 'bg-gradient-to-r from-red-500 to-red-600'
    };
    return colors[type] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const scrollToForm = () => {
    setIsFormVisible(true);
    setTimeout(() => {
      document.getElementById('event-form').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 p-2"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = events[dateKey] || [];
      const isToday = dateKey === formatDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-20 p-2 border border-gray-100 cursor-pointer transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:scale-105 hover:shadow-lg hover:shadow-blue-200/50 group relative overflow-hidden ${
            isToday ? 'bg-gradient-to-br from-blue-100 to-purple-100 ring-2 ring-blue-400 shadow-lg' : ''
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex flex-col h-full relative z-10">
            <span className={`text-sm font-bold transition-all duration-200 ${
              isToday 
                ? 'text-blue-700 text-lg' 
                : 'text-gray-700 group-hover:text-gray-900 group-hover:scale-110'
            }`}>
              {day}
            </span>
            <div className="flex-1 overflow-hidden mt-1">
              {dayEvents.slice(0, 2).map((event, idx) => (
                <div
                  key={event.id}
                  className={`text-xs px-2 py-1 rounded-full mb-1 text-white truncate transform transition-all duration-200 hover:scale-105 ${getEventTypeColor(event.type)} shadow-sm`}
                  style={{ 
                    animationDelay: `${idx * 100}ms`,
                    animation: 'fadeInUp 0.3s ease-out forwards'
                  }}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-500 font-medium animate-pulse">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className={`relative z-20 transition-all duration-1000 ${animations.headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 py-4">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">EventFlow</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-white/80">
              <a href="#calendar" className="hover:text-white transition-colors duration-200 hover:underline">Calendar</a>
              <a href="#events" className="hover:text-white transition-colors duration-200 hover:underline">Submit Event</a>
              <a href="#contact" className="hover:text-white transition-colors duration-200 hover:underline">Contact</a>
            </div>
            <button 
              onClick={scrollToForm}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Submit Event <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className={`text-center mb-16 transition-all duration-1000 ${animations.headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
              Manage Your Events
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create, organize, and discover events with our advanced calendar platform. 
              Submit your events and let the community know what's happening.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToForm}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
              >
                <Plus className="w-5 h-5" />
                Submit Your Event
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20">
                View Calendar
              </button>
            </div>
          </div>

          {/* Features */}
          <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 ${animations.headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { icon: Calendar, title: 'Smart Calendar', desc: 'Intuitive calendar interface with advanced filtering' },
              { icon: Star, title: 'Event Management', desc: 'Complete event lifecycle management system' },
              { icon: CheckCircle, title: 'Real-time Updates', desc: 'Instant notifications and live event updates' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Calendar Section */}
          <div id="calendar" className={`transition-all duration-1000 delay-500 ${animations.calendarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Calendar Header */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Event Calendar</h2>
                  <p className="text-white/70">Browse and discover upcoming events</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-3 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 group"
                  >
                    <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-300" />
                  </button>
                  <h3 className="text-2xl font-bold text-white min-w-64 text-center">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-3 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 group"
                  >
                    <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gradient-to-r from-blue-600 to-purple-700">
                {dayNames.map(day => (
                  <div key={day} className="p-4 text-center text-white font-bold text-lg">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 bg-white/5">
                {renderCalendarDays()}
              </div>
            </div>
          </div>

          {/* Event Submission Form */}
          <div id="event-form" className={`mt-20 transition-all duration-1000 delay-700 ${animations.formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">Submit Your Event</h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                  Share your event with our community. Fill out the form below and we'll add it to our calendar.
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                      className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={newEvent.email}
                      onChange={(e) => setNewEvent({...newEvent, email: e.target.value})}
                      className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Organization
                    </label>
                    <input
                      type="text"
                      value={newEvent.organization}
                      onChange={(e) => setNewEvent({...newEvent, organization: e.target.value})}
                      className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                      placeholder="Your organization name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    placeholder="Enter your event title"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time
                    </label>
                    <input
                      type="text"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                      placeholder="e.g., 2:00 PM"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                      placeholder="Event location"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-white font-semibold mb-2">Event Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                      className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                    >
                      <option value="work" className="bg-gray-800">Work</option>
                      <option value="meeting" className="bg-gray-800">Meeting</option>
                      <option value="personal" className="bg-gray-800">Personal</option>
                      <option value="deadline" className="bg-gray-800">Deadline</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Event Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows="4"
                    className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/20 resize-none"
                    placeholder="Describe your event in detail..."
                  />
                </div>

                <button
                  onClick={addEvent}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <CheckCircle className="w-6 h-6" />
                  Submit Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 border border-white/20">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <p className="text-white/70 text-sm mt-1">
                    {events[selectedDate]?.length || 0} events scheduled
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="p-3 hover:bg-white/10 rounded-full transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {events[selectedDate]?.length > 0 ? (
                <div className="space-y-4">
                  {events[selectedDate].map(event => (
                    <div key={event.id} className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-4 h-4 rounded-full ${getEventTypeColor(event.type).replace('bg-gradient-to-r', 'bg-blue-500')}`}></div>
                            <h4 className="font-bold text-white text-lg">{event.title}</h4>
                          </div>
                          {event.time && (
                            <div className="flex items-center gap-2 text-white/70 mb-2">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2 text-white/70 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.organizer && (
                            <div className="flex items-center gap-2 text-white/70 mb-2">
                              <Building className="w-4 h-4" />
                              <span>{event.organizer}</span>
                            </div>
                          )}
                          {event.email && (
                            <div className="flex items-center gap-2 text-white/70 mb-2">
                              <Mail className="w-4 h-4" />
                              <span>{event.email}</span>
                            </div>
                          )}
                          {event.description && (
                            <div className="mt-3 p-3 bg-white/10 rounded-lg">
                              <p className="text-white/80 text-sm">{event.description}</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors duration-200 hover:text-red-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-4">No events scheduled for this day</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Add Event
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Quick Add Event</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter event title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Time</label>
                <input
                  type="text"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 2:00 PM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter location..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="personal" className="bg-gray-800">Personal</option>
                  <option value="work" className="bg-gray-800">Work</option>
                  <option value="meeting" className="bg-gray-800">Meeting</option>
                  <option value="deadline" className="bg-gray-800">Deadline</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addEvent}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-20 bg-white/5 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">EventFlow</span>
              </div>
              <p className="text-white/70 text-lg mb-6 max-w-md">
                The ultimate platform for event management and community engagement. 
                Create, discover, and participate in events that matter to you.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                  <Globe className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#calendar" className="text-white/70 hover:text-white transition-colors duration-200">View Calendar</a></li>
                <li><a href="#events" className="text-white/70 hover:text-white transition-colors duration-200">Submit Event</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-200">Event Guidelines</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
            
            <div id="contact">
              <h4 className="text-white font-bold text-lg mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/70">
                  <Mail className="w-4 h-4" />
                  <span>hello@eventflow.com</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <MapPin className="w-4 h-4" />
                  <span>123 Event Street, City, State 12345</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-white/60">
              © 2025 EventFlow. All rights reserved. Made with ❤️ for the community.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CalendarApp;