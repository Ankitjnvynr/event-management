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
  Instagram,
  Image,
  Users,
  Heart,
  Award,
  Target,
  Zap
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
        title: 'Ganga Aarti Ceremony', 
        time: '6:00 PM', 
        location: 'Dashashwamedh Ghat, Varanasi', 
        type: 'festival',
        organizer: 'Kashi Vishwanath Temple',
        email: 'events@kashivishwanath.org',
        description: 'Sacred evening aarti ceremony at the holy Ganges river',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400'
      },
      { 
        id: 2, 
        title: 'Yoga & Meditation Retreat', 
        time: '6:00 AM', 
        location: 'Rishikesh Ashram', 
        type: 'personal',
        organizer: 'Himalayan Yoga Institute',
        email: 'retreat@himyoga.com',
        description: 'Morning yoga and meditation session by the Ganges',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=400'
      }
    ],
    '2025-08-20': [
      { 
        id: 3, 
        title: 'Krishna Janmashtami Celebration', 
        time: '11:30 PM', 
        location: 'ISKCON Temple', 
        type: 'festival',
        organizer: 'ISKCON Community',
        email: 'celebrate@iskcon.org',
        description: 'Midnight celebration of Lord Krishna\'s birth',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
      }
    ],
    '2025-08-25': [
      { 
        id: 4, 
        title: 'Spiritual Discourse & Satsang', 
        time: '4:00 PM', 
        location: 'Community Hall', 
        type: 'cultural',
        organizer: 'Vedanta Society',
        email: 'satsang@vedanta.org',
        description: 'Weekly spiritual discourse and community gathering',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'
      }
    ]
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    location: '',
    type: 'festival',
    name: '',
    email: '',
    organization: '',
    description: '',
    date: '',
    image: ''
  });

  // Hindu Calendar Data
  const getHinduCalendarEvents = (year, month, day) => {
    const date = new Date(year, month, day);
    const hinduEvents = [];
    
    // Calculate lunar day (tithi) - simplified calculation
    const dayOfYear = Math.floor((date - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24));
    const lunarCycle = 29.5; // Approximate lunar month
    const lunarDay = Math.floor((dayOfYear % lunarCycle) + 1);
    
    // Ekadashi (11th day of lunar fortnight)
    if (lunarDay === 11 || lunarDay === 26) {
      hinduEvents.push({
        type: 'ekadashi',
        name: 'Ekadashi',
        description: 'Sacred fasting day dedicated to Lord Vishnu'
      });
    }
    
    // Purnima (Full Moon - 15th day)
    if (lunarDay === 15) {
      hinduEvents.push({
        type: 'purnima',
        name: 'Purnima',
        description: 'Full Moon day - auspicious for prayers and meditation'
      });
    }
    
    // Amavasya (New Moon - 30th day)
    if (lunarDay === 30 || lunarDay === 1) {
      hinduEvents.push({
        type: 'amavasya',
        name: 'Amavasya',
        description: 'New Moon day - time for ancestor worship'
      });
    }
    
    // Pradosh (13th day)
    if (lunarDay === 13 || lunarDay === 28) {
      hinduEvents.push({
        type: 'pradosh',
        name: 'Pradosh Vrat',
        description: 'Sacred to Lord Shiva'
      });
    }
    
    // Chaturthi (4th day - Ganesh)
    if (lunarDay === 4 || lunarDay === 19) {
      hinduEvents.push({
        type: 'chaturthi',
        name: 'Chaturthi',
        description: 'Sacred to Lord Ganesha'
      });
    }
    
    // Major Hindu Festivals (approximate dates)
    const monthDay = `${month + 1}-${day}`;
    const festivals = {
      '1-14': { name: 'Makar Sankranti', type: 'festival', description: 'Harvest festival and transition of sun' },
      '1-26': { name: 'Republic Day', type: 'national', description: 'National holiday' },
      '2-18': { name: 'Maha Shivratri', type: 'festival', description: 'Great night of Lord Shiva' },
      '3-8': { name: 'Holi', type: 'festival', description: 'Festival of colors' },
      '3-30': { name: 'Ram Navami', type: 'festival', description: 'Birth of Lord Rama' },
      '4-14': { name: 'Baisakhi', type: 'festival', description: 'Harvest festival' },
      '5-23': { name: 'Buddha Purnima', type: 'festival', description: 'Birth of Lord Buddha' },
      '8-15': { name: 'Independence Day', type: 'national', description: 'National holiday' },
      '8-19': { name: 'Janmashtami', type: 'festival', description: 'Birth of Lord Krishna' },
      '8-22': { name: 'Ganesh Chaturthi', type: 'festival', description: 'Birth of Lord Ganesha' },
      '9-15': { name: 'Anant Chaturdashi', type: 'festival', description: 'End of Ganesh festival' },
      '10-2': { name: 'Gandhi Jayanti', type: 'national', description: 'Birth of Mahatma Gandhi' },
      '10-15': { name: 'Dussehra', type: 'festival', description: 'Victory of good over evil' },
      '11-1': { name: 'Diwali', type: 'festival', description: 'Festival of lights' },
      '11-15': { name: 'Guru Nanak Jayanti', type: 'festival', description: 'Birth of Guru Nanak' },
      '12-25': { name: 'Christmas', type: 'festival', description: 'Birth of Jesus Christ' }
    };
    
    if (festivals[monthDay]) {
      hinduEvents.push(festivals[monthDay]);
    }
    
    return hinduEvents;
  };

  const getHinduEventColor = (type) => {
    const colors = {
      ekadashi: 'bg-gradient-to-r from-red-500 to-orange-500',
      purnima: 'bg-gradient-to-r from-yellow-400 to-orange-400',
      amavasya: 'bg-gradient-to-r from-red-800 to-red-900',
      pradosh: 'bg-gradient-to-r from-orange-600 to-red-600',
      chaturthi: 'bg-gradient-to-r from-yellow-500 to-red-500',
      festival: 'bg-gradient-to-r from-red-600 to-yellow-500',
      national: 'bg-gradient-to-r from-orange-500 to-red-500'
    };
    return colors[type] || 'bg-gradient-to-r from-red-500 to-yellow-500';
  };

  const getEventTypeColor = (type) => {
    const colors = {
      work: 'bg-gradient-to-r from-orange-500 to-red-500',
      meeting: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      personal: 'bg-gradient-to-r from-red-500 to-pink-500',
      deadline: 'bg-gradient-to-r from-red-600 to-red-700',
      festival: 'bg-gradient-to-r from-red-500 to-yellow-500',
      cultural: 'bg-gradient-to-r from-yellow-600 to-red-600'
    };
    return colors[type] || 'bg-gradient-to-r from-red-500 to-yellow-500';
  };

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
      type: 'festival', 
      name: '', 
      email: '', 
      organization: '', 
      description: '', 
      date: '',
      image: ''
    });
    setShowCreateModal(false);
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter(event => event.id !== eventId)
    }));
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
        <div key={`empty-${i}`} className="h-24 p-2"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = events[dateKey] || [];
      const hinduEvents = getHinduCalendarEvents(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = dateKey === formatDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 p-2 border border-yellow-200/30 cursor-pointer transition-all duration-300 hover:bg-gradient-to-br hover:from-red-50/20 hover:to-yellow-50/20 hover:scale-105 hover:shadow-lg hover:shadow-red-200/50 group relative overflow-hidden ${
            isToday ? 'bg-gradient-to-br from-red-100/30 to-yellow-100/30 ring-2 ring-yellow-400 shadow-lg' : ''
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex flex-col h-full relative z-10">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm font-bold transition-all duration-200 ${
                isToday 
                  ? 'text-yellow-100 text-lg' 
                  : 'text-yellow-100 group-hover:text-white group-hover:scale-110'
              }`}>
                {day}
              </span>
              {hinduEvents.length > 0 && (
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              {/* Hindu Calendar Events */}
              {hinduEvents.slice(0, 1).map((hinduEvent, idx) => (
                <div
                  key={`hindu-${idx}`}
                  className={`text-xs px-1 py-0.5 rounded-full mb-1 text-white truncate ${getHinduEventColor(hinduEvent.type)} shadow-sm border border-yellow-300/30`}
                  title={hinduEvent.description}
                >
                  🕉️ {hinduEvent.name}
                </div>
              ))}
              
              {/* Regular Events */}
              {dayEvents.slice(0, hinduEvents.length > 0 ? 1 : 2).map((event, idx) => (
                <div
                  key={event.id}
                  className={`text-xs px-2 py-1 rounded-full mb-1 text-white truncate transform transition-all duration-200 hover:scale-105 ${getEventTypeColor(event.type)} shadow-sm`}
                  style={{ 
                    animationDelay: `${(idx + hinduEvents.length) * 100}ms`,
                    animation: 'fadeInUp 0.3s ease-out forwards'
                  }}
                >
                  {event.title}
                </div>
              ))}
              
              {/* Show total count if more events */}
              {(dayEvents.length + hinduEvents.length) > 2 && (
                <div className="text-xs text-yellow-200 font-medium animate-pulse">
                  +{(dayEvents.length + hinduEvents.length) - 2} more
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
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-500/15 to-red-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-r from-red-400/15 to-yellow-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <header className={`relative z-20 transition-all duration-1000 ${animations.headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <nav className="bg-red-900/20 backdrop-blur-md border-b border-yellow-300/20 py-4">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-red-600 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-yellow-100">🕉️ SpiritualEvents</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-yellow-100/80">
              <a href="#calendar" className="hover:text-yellow-100 transition-colors duration-200 hover:underline">Calendar</a>
              <a href="#events" className="hover:text-yellow-100 transition-colors duration-200 hover:underline">Submit Event</a>
              <a href="#gallery" className="hover:text-yellow-100 transition-colors duration-200 hover:underline">Gallery</a>
              <a href="#sponsors" className="hover:text-yellow-100 transition-colors duration-200 hover:underline">Sponsors</a>
              <a href="#contact" className="hover:text-yellow-100 transition-colors duration-200 hover:underline">Contact</a>
            </div>
            <button 
              onClick={scrollToForm}
              className="bg-gradient-to-r from-yellow-500 to-red-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2"
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
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 bg-clip-text text-transparent mb-6 leading-tight">
              🕉️ Sacred Events Calendar
            </h1>
            <p className="text-xl text-yellow-100/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover and celebrate spiritual events with our sacred calendar featuring Hindu traditions, festivals, 
              and divine observances. Connect with your spiritual community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToForm}
                className="bg-gradient-to-r from-yellow-500 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
              >
                <Plus className="w-5 h-5" />
                Add Sacred Event
              </button>
              <button className="bg-red-900/30 backdrop-blur-md text-yellow-100 px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-900/50 transition-all duration-300 border border-yellow-300/30">
                View Calendar
              </button>
            </div>
          </div>

          {/* Features */}
          <div className={`grid md:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-300 ${animations.headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { icon: Calendar, title: 'Sacred Calendar', desc: 'Complete Hindu calendar with sacred observances' },
              { icon: Star, title: 'Divine Festivals', desc: 'Ekadashi, Purnima, Janmashtami & all major festivals' },
              { icon: Heart, title: 'Spiritual Events', desc: 'Community gatherings, aarti, satsang & meditation' },
              { icon: Globe, title: 'Cultural Heritage', desc: 'Preserve and celebrate ancient traditions' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-red-900/20 backdrop-blur-md rounded-2xl p-8 border border-yellow-300/20 hover:bg-red-900/30 transition-all duration-300 hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-yellow-100 mb-3">{feature.title}</h3>
                <p className="text-yellow-100/70">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Calendar Section */}
          <div id="calendar" className={`transition-all duration-1000 delay-500 ${animations.calendarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Calendar Header */}
            <div className="bg-red-900/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-6 border border-yellow-300/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-yellow-100 mb-2">🕉️ Sacred Event Calendar</h2>
                  <p className="text-yellow-100/70">Discover divine celebrations and spiritual gatherings</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-3 hover:bg-red-900/20 rounded-full transition-all duration-200 hover:scale-110 group"
                  >
                    <ChevronLeft className="w-6 h-6 text-yellow-100 group-hover:text-yellow-200" />
                  </button>
                  <h3 className="text-2xl font-bold text-yellow-100 min-w-64 text-center">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-3 hover:bg-red-900/20 rounded-full transition-all duration-200 hover:scale-110 group"
                  >
                    <ChevronRight className="w-6 h-6 text-yellow-100 group-hover:text-yellow-200" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-red-900/20 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-yellow-300/20">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gradient-to-r from-red-700 to-yellow-600">
                {dayNames.map(day => (
                  <div key={day} className="p-4 text-center text-white font-bold text-lg">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 bg-red-900/10">
                {renderCalendarDays()}
              </div>
            </div>
          </div>

          {/* Event Gallery Section */}
          <div id="gallery" className={`mt-20 transition-all duration-1000 delay-700 ${animations.formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-red-900/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-yellow-300/20 mb-12">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-yellow-100 mb-4 flex items-center justify-center gap-3">
                  🖼️ Sacred Moments Gallery
                </h2>
                <p className="text-yellow-100/70 text-lg max-w-2xl mx-auto">
                  Experience the divine beauty of spiritual celebrations through our community gallery
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { 
                    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
                    title: 'Ganga Aarti',
                    description: 'Evening prayers at the holy Ganges'
                  },
                  { 
                    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                    title: 'Krishna Janmashtami',
                    description: 'Celebrating Lord Krishna\'s birth'
                  },
                  { 
                    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=400',
                    title: 'Yoga & Meditation',
                    description: 'Morning spiritual practices'
                  },
                  { 
                    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
                    title: 'Spiritual Discourse',
                    description: 'Community satsang gathering'
                  },
                  { 
                    image: 'https://images.unsplash.com/photo-1544949343-4a80e019f52f?w=400',
                    title: 'Temple Festival',
                    description: 'Traditional temple celebration'
                  },
                  { 
                    image: 'https://images.unsplash.com/photo-1514497730914-2e4b7b2a96fc?w=400',
                    title: 'Diwali Celebration',
                    description: 'Festival of lights ceremony'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="group relative overflow-hidden rounded-xl hover:scale-105 transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-red-300 to-yellow-300 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-yellow-500/20"></div>
                      <Image className="w-16 h-16 text-white/80 z-10" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-white/80 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sponsors Section */}
          <div id="sponsors" className={`mt-12 transition-all duration-1000 delay-800 ${animations.formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-red-900/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-yellow-300/20 mb-12">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-yellow-100 mb-4 flex items-center justify-center gap-3">
                  🤝 Our Sacred Partners
                </h2>
                <p className="text-yellow-100/70 text-lg max-w-2xl mx-auto">
                  Supporting spiritual growth and cultural preservation in our community
                </p>
              </div>

              {/* Featured Sponsors */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-xl p-6 border border-yellow-300/30 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-red-600 rounded-xl flex items-center justify-center">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-100">Sacred Temples Network</h3>
                      <p className="text-yellow-100/70">Premium Sponsor</p>
                    </div>
                  </div>
                  <p className="text-yellow-100/80 mb-4">Connecting devotees with sacred spaces across the nation. Join our temple network for exclusive spiritual events and blessings.</p>
                  <button className="bg-gradient-to-r from-yellow-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
                    Learn More
                  </button>
                </div>

                <div className="bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-xl p-6 border border-yellow-300/30 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-100">Spiritual Wellness Center</h3>
                      <p className="text-yellow-100/70">Gold Sponsor</p>
                    </div>
                  </div>
                  <p className="text-yellow-100/80 mb-4">Holistic wellness through ancient wisdom. Yoga, meditation, and Ayurveda programs for mind-body-soul harmony.</p>
                  <button className="bg-gradient-to-r from-red-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
                    Visit Center
                  </button>
                </div>
              </div>

              {/* Partner Logos */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                {[
                  { name: 'ISKCON', icon: Star },
                  { name: 'Art of Living', icon: Users },
                  { name: 'Brahma Kumaris', icon: Heart },
                  { name: 'Isha Foundation', icon: Globe },
                  { name: 'Chinmaya Mission', icon: Award },
                  { name: 'Arya Samaj', icon: Target }
                ].map((partner, idx) => (
                  <div key={idx} className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-300/20 hover:bg-yellow-900/30 transition-all duration-300 hover:scale-105 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <partner.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-yellow-100 text-sm font-semibold">{partner.name}</p>
                  </div>
                ))}
              </div>

              {/* Sponsor CTA */}
              <div className="text-center mt-8 p-6 bg-gradient-to-r from-red-600/20 to-yellow-600/20 rounded-xl border border-yellow-300/30">
                <h3 className="text-2xl font-bold text-yellow-100 mb-3">🌟 Become a Sacred Partner</h3>
                <p className="text-yellow-100/80 mb-4">Support spiritual growth in your community. Sponsor events, temples, and cultural programs.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-yellow-500 to-red-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105">
                    Sponsor Events
                  </button>
                  <button className="border border-yellow-300/50 text-yellow-100 px-6 py-3 rounded-lg hover:bg-yellow-900/20 transition-all duration-200">
                    Partnership Info
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Event Submission Form */}
          <div id="event-form" className={`mt-20 transition-all duration-1000 delay-700 ${animations.formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-red-900/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-yellow-300/20">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-yellow-100 mb-4 flex items-center justify-center gap-3">
                  🕉️ Submit Sacred Event
                </h2>
                <p className="text-yellow-100/70 text-lg max-w-2xl mx-auto">
                  Share your spiritual event with our divine community. Include festivals, celebrations, 
                  and sacred gatherings to help others connect with Hindu traditions.
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                      className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={newEvent.email}
                      onChange={(e) => setNewEvent({...newEvent, email: e.target.value})}
                      className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Organization/Temple
                    </label>
                    <input
                      type="text"
                      value={newEvent.organization}
                      onChange={(e) => setNewEvent({...newEvent, organization: e.target.value})}
                      className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                      placeholder="Temple or organization name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                    placeholder="Enter your sacred event title"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time
                    </label>
                    <input
                      type="text"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                      placeholder="e.g., 6:00 PM"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                      placeholder="Temple or venue"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-yellow-100 font-semibold mb-2">Event Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                      className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                    >
                      <option value="festival" className="bg-red-800">Festival/Religious</option>
                      <option value="cultural" className="bg-red-800">Cultural Event</option>
                      <option value="personal" className="bg-red-800">Personal Celebration</option>
                      <option value="work" className="bg-red-800">Community Service</option>
                      <option value="meeting" className="bg-red-800">Spiritual Gathering</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Event Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newEvent.image}
                    onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-yellow-100 font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Event Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows="4"
                    className="w-full p-4 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-red-900/30 resize-none"
                    placeholder="Describe your sacred event, its significance, and what participants can expect..."
                  />
                </div>

                <button
                  onClick={addEvent}
                  className="w-full bg-gradient-to-r from-yellow-500 to-red-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <CheckCircle className="w-6 h-6" />
                  Submit Sacred Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-red-900/20 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 border border-yellow-300/20">
            <div className="p-6 border-b border-yellow-300/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-yellow-100">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <p className="text-yellow-100/70 text-sm mt-1">
                    {events[selectedDate]?.length || 0} events scheduled
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="p-3 bg-gradient-to-r from-yellow-500 to-red-600 text-white rounded-full hover:shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="p-3 hover:bg-red-900/20 rounded-full transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-yellow-100" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Show Hindu Calendar Events */}
              {(() => {
                const hinduEvents = getHinduCalendarEvents(
                  new Date(selectedDate).getFullYear(),
                  new Date(selectedDate).getMonth(),
                  new Date(selectedDate).getDate()
                );
                
                return (
                  <>
                    {hinduEvents.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-yellow-100 font-bold text-lg mb-3 flex items-center gap-2">
                          🕉️ Hindu Calendar
                        </h4>
                        <div className="space-y-3">
                          {hinduEvents.map((hinduEvent, idx) => (
                            <div key={`hindu-${idx}`} className="p-4 bg-gradient-to-r from-red-500/20 to-yellow-500/20 backdrop-blur-md rounded-xl border border-yellow-300/30">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-4 h-4 rounded-full ${getHinduEventColor(hinduEvent.type).replace('bg-gradient-to-r', 'bg-red-500')}`}></div>
                                <h5 className="font-bold text-yellow-100 text-lg">{hinduEvent.name}</h5>
                                <span className="px-2 py-1 bg-yellow-500/30 text-yellow-100 text-xs rounded-full">
                                  {hinduEvent.type}
                                </span>
                              </div>
                              <p className="text-yellow-100/80 text-sm">{hinduEvent.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {events[selectedDate]?.length > 0 && (
                      <div>
                        <h4 className="text-yellow-100 font-bold text-lg mb-3 flex items-center gap-2">
                          📅 Sacred Events
                        </h4>
                        <div className="space-y-4">
                          {events[selectedDate].map(event => (
                            <div key={event.id} className="p-6 bg-red-900/20 backdrop-blur-md rounded-xl border border-yellow-300/20 hover:bg-red-900/30 transition-all duration-300">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-4 h-4 rounded-full ${getEventTypeColor(event.type).replace('bg-gradient-to-r', 'bg-red-500')}`}></div>
                                    <h4 className="font-bold text-yellow-100 text-lg">{event.title}</h4>
                                  </div>
                                  {event.image && (
                                    <div className="mb-3 rounded-lg overflow-hidden">
                                      <div className="w-full h-32 bg-gradient-to-br from-red-300 to-yellow-300 rounded-lg flex items-center justify-center">
                                        <Image className="w-8 h-8 text-white" />
                                      </div>
                                    </div>
                                  )}
                                  {event.time && (
                                    <div className="flex items-center gap-2 text-yellow-100/70 mb-2">
                                      <Clock className="w-4 h-4" />
                                      <span>{event.time}</span>
                                    </div>
                                  )}
                                  {event.location && (
                                    <div className="flex items-center gap-2 text-yellow-100/70 mb-2">
                                      <MapPin className="w-4 h-4" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                  {event.organizer && (
                                    <div className="flex items-center gap-2 text-yellow-100/70 mb-2">
                                      <Building className="w-4 h-4" />
                                      <span>{event.organizer}</span>
                                    </div>
                                  )}
                                  {event.email && (
                                    <div className="flex items-center gap-2 text-yellow-100/70 mb-2">
                                      <Mail className="w-4 h-4" />
                                      <span>{event.email}</span>
                                    </div>
                                  )}
                                  {event.description && (
                                    <div className="mt-3 p-3 bg-red-900/20 rounded-lg">
                                      <p className="text-yellow-100/80 text-sm">{event.description}</p>
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
                      </div>
                    )}
                    
                    {events[selectedDate]?.length === 0 && hinduEvents.length === 0 && (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-yellow-100/30 mx-auto mb-4" />
                        <p className="text-yellow-100/60 text-lg mb-4">No events scheduled for this day</p>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          Add Event
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-red-900/20 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md border border-yellow-300/20">
            <div className="p-6 border-b border-yellow-300/20">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-yellow-100">Quick Add Event</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-red-900/20 rounded-full transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-yellow-100" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-100 mb-2">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full p-3 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-lg text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter event title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-yellow-100 mb-2">Time</label>
                <input
                  type="text"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="w-full p-3 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-lg text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 6:00 PM"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-yellow-100 mb-2">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full p-3 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-lg text-yellow-100 placeholder-yellow-200/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter location..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-yellow-100 mb-2">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full p-3 bg-red-900/20 backdrop-blur-md border border-yellow-300/30 rounded-lg text-yellow-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="festival" className="bg-red-800">Festival/Religious</option>
                  <option value="cultural" className="bg-red-800">Cultural Event</option>
                  <option value="personal" className="bg-red-800">Personal</option>
                  <option value="work" className="bg-red-800">Community Service</option>
                  <option value="meeting" className="bg-red-800">Spiritual Gathering</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-yellow-300/30 text-yellow-100 rounded-lg hover:bg-red-900/20 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addEvent}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-20 bg-red-900/10 backdrop-blur-md border-t border-yellow-300/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-yellow-100">🕉️ SpiritualEvents</span>
              </div>
              <p className="text-yellow-100/70 text-lg mb-6 max-w-md">
                Sacred platform for Hindu spiritual events and community gatherings. 
                Connect with divine traditions and celebrate our ancient heritage together.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center hover:bg-red-900/30 transition-colors duration-200">
                  <Twitter className="w-5 h-5 text-yellow-100" />
                </a>
                <a href="#" className="w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center hover:bg-red-900/30 transition-colors duration-200">
                  <Linkedin className="w-5 h-5 text-yellow-100" />
                </a>
                <a href="#" className="w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center hover:bg-red-900/30 transition-colors duration-200">
                  <Instagram className="w-5 h-5 text-yellow-100" />
                </a>
                <a href="#" className="w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center hover:bg-red-900/30 transition-colors duration-200">
                  <Globe className="w-5 h-5 text-yellow-100" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-yellow-100 font-bold text-lg mb-4">Sacred Links</h4>
              <ul className="space-y-3">
                <li><a href="#calendar" className="text-yellow-100/70 hover:text-yellow-100 transition-colors duration-200">Hindu Calendar</a></li>
                <li><a href="#events" className="text-yellow-100/70 hover:text-yellow-100 transition-colors duration-200">Submit Event</a></li>
                <li><a href="#gallery" className="text-yellow-100/70 hover:text-yellow-100 transition-colors duration-200">Sacred Gallery</a></li>
                <li><a href="#sponsors" className="text-yellow-100/70 hover:text-yellow-100 transition-colors duration-200">Partners</a></li>
                <li><a href="#" className="text-yellow-100/70 hover:text-yellow-100 transition-colors duration-200">Festival Guide</a></li>
              </ul>
            </div>
            
            <div id="contact">
              <h4 className="text-yellow-100 font-bold text-lg mb-4">Sacred Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-yellow-100/70">
                  <Mail className="w-4 h-4" />
                  <span>namaste@spiritualevents.org</span>
                </div>
                <div className="flex items-center gap-3 text-yellow-100/70">
                  <Phone className="w-4 h-4" />
                  <span>+91 (555) 108-108</span>
                </div>
                <div className="flex items-center gap-3 text-yellow-100/70">
                  <MapPin className="w-4 h-4" />
                  <span>Spiritual Center, Varanasi, India</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-yellow-300/20 mt-12 pt-8 text-center">
            <p className="text-yellow-100/60">
              © 2025 SpiritualEvents. All rights reserved. Made with 🕉️ for the divine community.
            </p>
            <p className="text-yellow-100/50 text-sm mt-2">
              "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः" - May all beings be happy and free from illness
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