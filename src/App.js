import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./screens/sign-in";
import ForgetPassword from "./screens/forget-password";
import CodeVerification from "./screens/code-verification";
import ResetPassword from "./screens/reset-password";
import Signup from "./screens/sign-up";
// import Dashboard from "./screens/dashboard";
import AudioList from "./screens/audio-list";
import Settings from "./screens/settings";
import PlaybackSchedule from "./screens/playback-schedule";
import UploadAudio from "./screens/upload-audio";
import UploadedAudio from "./screens/uploaded-audio";
import Favorite from "./screens/favorite-audio";
import GenerateCode from "./screens/generate-code";
import { useEffect } from "react";
import moment from "moment-timezone";
import axios from "axios";
import Configurations from "./screens/configurations";
import NamazTiming from "./screens/namaz-timing";

function App() {
  useEffect(() => {
    // Get user's location and timezone
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const timezone = moment.tz.guess();
        const data = { latitude, longitude, timezone };
        // await axios.post("/location", data);
      });
    }
  }, []);

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/code-verification" element={<CodeVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/*" element={<Navigate to="/audio-list" />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/audio-list" element={<AudioList />} />
        <Route path="/playback-schedule" element={<PlaybackSchedule />} />
        <Route path="/upload-audio" element={<UploadAudio />} />
        <Route path="/uploaded-audio" element={<UploadedAudio />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/generate-code" element={<GenerateCode />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/configurations" element={<Configurations />} />
        <Route path="/namaz-timing" element={<NamazTiming />} />
        {/* <Route path="/logout" element={<Configurations />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
