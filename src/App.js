import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import axios from "axios";
import SignIn from "./screens/sign-in";
import ForgetPassword from "./screens/forget-password";
import CodeVerification from "./screens/code-verification";
import ResetPassword from "./screens/reset-password";
import Signup from "./screens/sign-up";
import AudioList from "./screens/audio-list";
import Settings from "./screens/settings";
import PlaybackSchedule from "./screens/playback-schedule";
import UploadAudio from "./screens/upload-audio";
import UploadedAudio from "./screens/uploaded-audio";
import FavoriteAudio from "./screens/favorite-audio";
import GenerateCode from "./screens/generate-code";
import Configuration from "./screens/configuration";
import NamazTiming from "./screens/namaz-timing";
import NamazMethod from "./screens/namaz-method";
import Location from "./screens/location";
import PrivateRoute from "./private-route";

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

        {/* Protected Routes */}
        <Route
          path="/audio-list/*"
          element={<PrivateRoute element={AudioList} />}
        />
        <Route
          path="/playback-schedule"
          element={<PrivateRoute element={PlaybackSchedule} />}
        />
        <Route
          path="/upload-audio"
          element={<PrivateRoute element={UploadAudio} />}
        />
        <Route
          path="/uploaded-audio"
          element={<PrivateRoute element={UploadedAudio} />}
        />
        <Route
          path="/favorite-audio"
          element={<PrivateRoute element={FavoriteAudio} />}
        />
        <Route
          path="/generate-code"
          element={<PrivateRoute element={GenerateCode} />}
        />
        <Route
          path="/configuration"
          element={<PrivateRoute element={Configuration} />}
        />
        <Route
          path="/namaz-timing"
          element={<PrivateRoute element={NamazTiming} />}
        />
        <Route
          path="/namaz-method"
          element={<PrivateRoute element={NamazMethod} />}
        />
        <Route path="/location" element={<PrivateRoute element={Location} />} />
        <Route path="/*" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
