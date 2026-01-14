import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../profile.css";

// Dummy data — replace with API data
const ratingHistory = [
  { date: "Jan 6", rating: 1010 },
  { date: "Jan 8", rating: 1030 },
  { date: "Jan 10", rating: 1036 },
];

type user={
    handle:string,
    rank:string,
    rating:number,
    maxRank:string,
    best:number,
    email:string,
    isLogged:boolean
}

export default function ProfilePage(user:user) {
  const [User, setUser] = useState<user>({
  handle: "",
  rank: "",
  rating: 0,
  maxRank: "",
  best: 0,
  email: "",
  isLogged: false
});

  const [handle,setHandle]=useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      isLogged:true
    });
  };
  user = {
    handle: "harsh_dahiya",
    rank: "Newbie",
    rating: 1036,
    maxRank: "newbie",
    best: 1573,
    isLogged:false,
    email: "dahiyaharsh2005@gmail.com",
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-info">
            <p className="rank">{user.rank}</p>
            {user.isLogged ? (
              <h1 className="handle">{user.handle}</h1>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Enter your handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  required
                />
                <button type="submit">Submit</button>
              </form>
            )}

            <div className="stats">
              <div className="stat">
                <p className="label">Contest Rating</p>
                <p className="value">{user.rating} <span className="muted">(max. {user.maxRank}, {user.rating})</span></p>
              </div>
              <div className="stat">
                <p className="label">Best Performance</p>
                <p className="value">{user.best}</p>
              </div>
              
              <div className="stat">
                <p className="label">Email</p>
                <p className="value email">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Graph Card */}
        (
          <div className="graph-card">
            <h2 className="graph-title">Rating Progress</h2>
            <div className="graph-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingHistory}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[800, 2200]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )

      </div>
    </div>
  );
}
