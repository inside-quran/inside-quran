import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import ThemeToggleFloating from "@/components/ThemeToggleFloating";
import SurahListPage from "@/pages/SurahListPage";
import SurahReadingPage from "@/pages/SurahReadingPage";
import SavedPage from "@/pages/SavedPage";
import SettingsPage from "@/pages/SettingsPage";
import ExplanationBuilderPage from "@/pages/ExplanationBuilderPage";
import ExplanationViewPage from "@/pages/ExplanationViewPage";
import LibraryPage from "@/pages/LibraryPage";
import TafsirBuilderPage from "@/pages/TafsirBuilderPage";
import TafsirViewPage from "@/pages/TafsirViewPage";
import NoteViewPage from "@/pages/NoteViewPage";
import NoteBuilderPage from "@/pages/NoteBuilderPage";
import ExplorePage from "@/pages/ExplorePage";
import TopicsPage from "@/pages/TopicsPage";
import DuasPage from "@/pages/DuasPage";
import ShaneNuzulPage from "@/pages/ShaneNuzulPage";
import LastReadPage from "@/pages/LastReadPage";
import HelpSupportPage from "@/pages/HelpSupportPage";
import TajweedGuidePage from "@/pages/TajweedGuidePage";
import WordDetailsPage from "@/pages/WordDetailsPage";
import NotFound from "@/pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";

// Admin
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import TranslationEditor from "@/pages/admin/TranslationEditor";
import DiscoverEditor from "@/pages/admin/DiscoverEditor";
import AdminRoute from "@/components/admin/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SurahListPage />} />
          <Route path="/surah/:number" element={<SurahReadingPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/explanation-builder" element={<ExplanationBuilderPage />} />
          <Route path="/explanation-view" element={<ExplanationViewPage />} />
          <Route path="/tafsir-builder" element={<TafsirBuilderPage />} />
          <Route path="/tafsir-view" element={<TafsirViewPage />} />
          <Route path="/note-view" element={<NoteViewPage />} />
          <Route path="/note-builder" element={<NoteBuilderPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/topics" element={<TopicsPage />} />
          <Route path="/explore/duas" element={<DuasPage />} />
          <Route path="/explore/shane-nuzul" element={<ShaneNuzulPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/last-read" element={<LastReadPage />} />
          <Route path="/help" element={<HelpSupportPage />} />
          <Route path="/tajweed-guide" element={<TajweedGuidePage />} />
          <Route path="/word-details" element={<WordDetailsPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/translations" element={<AdminRoute><TranslationEditor /></AdminRoute>} />
          <Route path="/admin/duas" element={<AdminRoute><DiscoverEditor type="duas" /></AdminRoute>} />
          <Route path="/admin/topics" element={<AdminRoute><DiscoverEditor type="topics" /></AdminRoute>} />
          <Route path="/admin/shane-nuzul" element={<AdminRoute><DiscoverEditor type="shane-nuzul" /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
