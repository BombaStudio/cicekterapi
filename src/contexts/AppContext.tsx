'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { locales, Language, Translations } from '@/lib/locales';
import { auth, db } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type SurveyData = {
  healthStatus: string;
  dailyChallenges: string[];
  helpBarriers: string[];
  additionalInfo: string;
};

type ChatMessage = {
  sender: 'user' | 'ai';
  text: string;
  timestamp?: any;
};

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  translations: Translations;
  user: User | null;
  isAuthenticated: boolean;
  isSurveyCompleted: boolean;
  surveyData: SurveyData | null;
  chatHistory: ChatMessage[];
  login: (email:string, password:string) => Promise<void>;
  register: (email:string, password:string) => Promise<void>;
  logout: () => void;
  completeSurvey: (data: SurveyData) => Promise<void>;
  addChatMessage: (message: ChatMessage) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('tr');
  const [user, setUser] = useState<User | null>(null);
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const translations = locales[lang];

  useEffect(() => {
    const storedLang = localStorage.getItem('cicek_terapi_lang') as Language;
    if (storedLang && locales[storedLang]) {
      setLang(storedLang);
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const surveyDocRef = doc(db, 'surveys', currentUser.uid);
        const surveyDocSnap = await getDoc(surveyDocRef);
        if (surveyDocSnap.exists()) {
          setIsSurveyCompleted(true);
          setSurveyData(surveyDocSnap.data() as SurveyData);
        } else {
          setIsSurveyCompleted(false);
        }
      } else {
        setIsSurveyCompleted(false);
        setSurveyData(null);
        setChatHistory([]);
        router.push('/');
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [router]);
  
  useEffect(() => {
    if (user && isSurveyCompleted) {
      const messagesColRef = collection(db, 'users', user.uid, 'chats');
      const q = query(messagesColRef, orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const history = snapshot.docs.map(doc => doc.data() as ChatMessage);
        if (history.length === 0) {
           setChatHistory([{ sender: 'ai', text: translations.chatWelcome }]);
        } else {
           setChatHistory(history);
        }
      });
      return () => unsubscribe();
    }
  }, [user, isSurveyCompleted, translations.chatWelcome]);


  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('cicek_terapi_lang', newLang);
  };

  const login = async (email:string, password:string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const surveyDocRef = doc(db, 'surveys', userCredential.user.uid);
      const surveyDocSnap = await getDoc(surveyDocRef);
      if(surveyDocSnap.exists()) {
        router.push('/dashboard');
      } else {
        router.push('/survey');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
      console.error(error);
    }
  };
  
  const register = async (email:string, password:string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/survey');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Registration Failed', description: error.message });
      console.error(error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const completeSurvey = async (data: SurveyData) => {
    if (user) {
      try {
        const surveyDocRef = doc(db, 'surveys', user.uid);
        await setDoc(surveyDocRef, data);
        setSurveyData(data);
        setIsSurveyCompleted(true);
        router.push('/dashboard');
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Survey Submission Failed', description: error.message });
        console.error(error);
      }
    }
  };

  const addChatMessage = async (message: ChatMessage) => {
    if (user) {
      try {
        const messagesColRef = collection(db, 'users', user.uid, 'chats');
        await addDoc(messagesColRef, {
          ...message,
          timestamp: serverTimestamp()
        });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Message Failed', description: "Could not save your message." });
        console.error("Error adding chat message to firestore:", error);
      }
    }
  };

  const value = {
    lang,
    setLang: handleSetLang,
    translations,
    user,
    isAuthenticated: !!user,
    isSurveyCompleted,
    surveyData,
    chatHistory,
    login,
    register,
    logout,
    completeSurvey,
    addChatMessage,
  };

  if (!isLoaded) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
