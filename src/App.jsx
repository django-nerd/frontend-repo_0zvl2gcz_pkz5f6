import { useEffect, useState } from 'react'
import { Github, Linkedin, Twitter, Menu } from 'lucide-react'

const iconMap = {
  GitHub: Github,
  Github: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
}

function SocialIcon({ label }) {
  const Icon = iconMap[label] || null
  if (!Icon) return null
  return <Icon className="w-5 h-5" />
}

export default function App() {
  const [profile, setProfile] = useState(null)
  const [diary, setDiary] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, d] = await Promise.all([
          fetch(`${baseUrl}/api/profile`).then(r => r.json()),
          fetch(`${baseUrl}/api/diary`).then(r => r.json()),
        ])
        setProfile(p)
        setDiary(Array.isArray(d) ? d : [])
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [baseUrl])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      <header className="sticky top-0 backdrop-blur bg-white/70 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500" />
            <span className="font-semibold">Diary</span>
          </div>
          <nav className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            {diary.map(item => (
              <a key={item.id} href={`#${item.id}`} className="px-3 py-1.5 rounded-full text-sm bg-gray-100 hover:bg-gray-200 transition">
                {item.title}
              </a>
            ))}
            <Menu className="w-5 h-5 text-gray-500" />
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Profile Card */}
        <section className="flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={profile?.photo_url || 'https://via.placeholder.com/160'}
              alt={profile?.name || 'Profile'}
              className="w-36 h-36 rounded-full object-cover ring-4 ring-white shadow-xl"
            />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            {profile?.name || 'Your Name'}
          </h1>
          {profile?.tagline && (
            <p className="mt-2 text-gray-600">{profile.tagline}</p>
          )}

          {/* Socials */}
          <div className="mt-6 flex items-center gap-3">
            {profile?.socials?.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
              >
                <SocialIcon label={s.label} />
                <span className="text-sm">{s.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Diary Sections */}
        {diary.length > 0 && (
          <section className="mt-14 space-y-8">
            {diary.map((item) => (
              <article id={item.id} key={item.id} className="p-6 rounded-xl border border-gray-200 hover:shadow-sm transition">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
                {item.summary && <p className="mt-2 text-gray-600">{item.summary}</p>}
                {item.content && <p className="mt-4 text-gray-700 leading-relaxed">{item.content}</p>}
              </article>
            ))}
          </section>
        )}

        {diary.length === 0 && (
          <p className="mt-16 text-center text-gray-500">
            Add entries to your diary JSON and they will appear here automatically.
          </p>
        )}
      </main>

      <footer className="py-10 text-center text-xs text-gray-500">
        Built with ❤️
      </footer>
    </div>
  )
}
