import React, { useState, useEffect } from 'react';
import { Camera, CameraOff, Mic, MicOff, MonitorUp, PhoneOff, Settings, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const VideoCallPage: React.FC = () => {
  const { user } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    toast.success('Call started');
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    toast('Call ended', { icon: '👋' });
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.success(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Virtual Meeting Room</h1>
        {isCallActive && (
          <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            {formatDuration(callDuration)}
          </div>
        )}
      </div>

      <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden relative shadow-lg flex items-center justify-center border-4 border-gray-800">
        {!isCallActive ? (
          <div className="text-center text-white p-6">
            <div className="mb-6 mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
              <Users size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Ready to join?</h2>
            <p className="text-gray-400 mb-8">No one else is here yet.</p>
            <Button onClick={handleStartCall} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full text-lg shadow-lg">
              Start Meeting
            </Button>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col md:flex-row p-4 gap-4">
            {/* Main Video Area (Remote or Screen Share) */}
            <div className="flex-1 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              {isScreenSharing ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-blue-900/30">
                  <MonitorUp size={64} className="text-blue-400 mb-4 opacity-50" />
                  <p className="text-blue-300 font-medium text-lg">You are sharing your screen</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                    alt="Remote User" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-sm text-white backdrop-blur-sm">
                    Investor / Entrepreneur
                  </div>
                </div>
              )}
            </div>

            {/* Local Video Area */}
            <div className="w-full md:w-64 lg:w-80 h-48 md:h-full bg-gray-800 rounded-lg overflow-hidden relative border border-gray-700 shadow-xl flex-shrink-0">
              {isVideoOff ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-xl text-gray-400 font-bold">
                    {user?.name.charAt(0)}
                  </div>
                </div>
              ) : (
                <img 
                  src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"} 
                  alt="Local User" 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur-sm flex items-center space-x-1">
                <span>{user?.name} (You)</span>
                {isMuted && <MicOff size={12} className="text-red-400" />}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        {isCallActive && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-900/80 backdrop-blur-md p-3 rounded-2xl border border-gray-700 shadow-2xl">
            <button 
              onClick={toggleMute}
              className={`p-3 rounded-full flex items-center justify-center transition ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
            </button>
            <button 
              onClick={toggleVideo}
              className={`p-3 rounded-full flex items-center justify-center transition ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              title={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? <CameraOff size={20} className="text-white" /> : <Camera size={20} className="text-white" />}
            </button>
            <button 
              onClick={toggleScreenShare}
              className={`p-3 rounded-full flex items-center justify-center transition ${isScreenSharing ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
              title="Share screen"
            >
              <MonitorUp size={20} />
            </button>
            <div className="w-px h-8 bg-gray-700 mx-2"></div>
            <button 
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
              title="Settings"
            >
              <Settings size={20} className="text-gray-300" />
            </button>
            <button 
              onClick={handleEndCall}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition px-6 flex items-center justify-center"
              title="End call"
            >
              <PhoneOff size={20} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
