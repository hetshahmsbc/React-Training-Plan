import { Link } from "react-router-dom";

// A job opening. In a real app this list would come from an API.
interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
}

const JOBS: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
  },
  {
    id: 3,
    title: "Customer Support Specialist",
    department: "Operations",
    location: "Remote",
    type: "Part-time",
  },
  {
    id: 4,
    title: "Digital Marketing Manager",
    department: "Marketing",
    location: "New York, NY",
    type: "Full-time",
  },
];

// Reasons to work here.
const PERKS = [
  { icon: "🏡", title: "Remote-friendly", text: "Work from anywhere, on your schedule." },
  { icon: "🌴", title: "Unlimited PTO", text: "Take the time you need to recharge." },
  { icon: "📈", title: "Growth budget", text: "$1,500/year for learning and courses." },
  { icon: "🩺", title: "Full benefits", text: "Health, dental, and vision covered." },
];

export function CareersPage() {
  return (
    <div className="page">
      <section className="page__hero">
        <h1>Careers at ShopVerse</h1>
        <p>
          Build the future of online shopping with a team that values curiosity,
          ownership, and kindness.
        </p>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>Why join us</h2>
        </div>
        <div className="perks perks--grid">
          {PERKS.map((perk) => (
            <div key={perk.title} className="perk">
              <span className="perk__icon">{perk.icon}</span>
              <div>
                <h3 className="perk__title">{perk.title}</h3>
                <p className="perk__text">{perk.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>Open positions</h2>
        </div>
        <ul className="jobs">
          {JOBS.map((job) => (
            <li key={job.id} className="job">
              <div>
                <h3 className="job__title">{job.title}</h3>
                <p className="job__meta">
                  {job.department} · {job.location} · {job.type}
                </p>
              </div>
              {/* Applications route to the contact page for this demo. */}
              <Link to="/contact" className="btn">
                Apply
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
