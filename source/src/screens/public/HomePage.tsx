import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import './homepage.css';

export function HomePage() {
  return (
    <div className="home">
      <a className="home-skip" href="#main">
        Skip to content
      </a>

      <header className="home-header">
        <div className="home-shell home-header-inner">
          <RouterLink to="/" className="home-wordmark" aria-label="miniTA home">
            miniTA
          </RouterLink>
          <nav className="home-nav" aria-label="Main">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <RouterLink to="/screens/SCR-01" className="home-signin">
              Sign in
            </RouterLink>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="home-shell home-hero-grid">
            <div className="home-hero-copy">
              <h1 id="hero-title">Recruiting for small teams, from job post to decision.</h1>
              <p>
                Publish a job, review applications with clear evidence, and keep candidates informed in one
                workspace.
              </p>
              <div className="home-actions">
                <Button variant="contained" component={RouterLink} to="/gallery">
                  Explore demo
                </Button>
                <Button variant="outlined" href="#how-it-works">
                  See how it works
                </Button>
              </div>
              <p className="home-note">Interactive prototype · Sample data</p>
            </div>

            <figure className="home-figure">
              <img
                src="/homepage/home-recruiting-illustration.png"
                width={1220}
                height={740}
                alt="Illustration of a recruiter reviewing three candidate profiles."
                loading="eager"
                fetchPriority="high"
              />
            </figure>
          </div>
        </section>

        <section id="features" className="home-features" aria-labelledby="features-title">
          <div className="home-shell">
            <h2 id="features-title" className="home-section-title">
              One workspace for the whole hiring loop.
            </h2>

            <div className="home-feature">
              <div className="home-feature-copy">
                <h3>Prepare each role</h3>
                <p>
                  Create a job posting and define its evaluation criteria. Start with an AI-assisted draft or
                  build the rubric by hand, then review it before publishing.
                </p>
              </div>
              <figure className="home-feature-media">
                <img
                  src="/homepage/home-rubric.png"
                  width={820}
                  height={272}
                  alt="Evaluation rubric scoring weights in miniTA that total 100 percent and are marked Weights valid."
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Scoring weights · sample data</figcaption>
              </figure>
            </div>

            <div className="home-feature">
              <div className="home-feature-copy">
                <h3>Review the evidence</h3>
                <p>
                  Review applications in one inbox and see the CV evidence behind a matching result. Recruiters
                  record the official decision.
                </p>
              </div>
              <figure className="home-feature-media">
                <img
                  src="/homepage/home-matching.png"
                  width={644}
                  height={478}
                  alt="Applicant detail showing an 86 percent matching score, two CV evidence quotes and the missing criteria."
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Matching evidence · sample data</figcaption>
              </figure>
            </div>

            <div className="home-feature home-feature--stacked">
              <div className="home-feature-copy">
                <h3>Keep candidates informed</h3>
                <p>
                  Candidates apply through a shared job link and check their application status through a
                  time-limited email link.
                </p>
                <RouterLink className="home-inline-link" to="/screens/SCR-22">
                  View sample job
                </RouterLink>
              </div>
              <figure className="home-feature-media">
                <div className="home-duo">
                  <img
                    src="/homepage/home-public-job.png"
                    width={860}
                    height={680}
                    alt="Public job page for the sample Software Engineer (Frontend) role with its description and an Apply button."
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    src="/homepage/home-status-mobile.png"
                    width={390}
                    height={553}
                    alt="Mobile application status page showing the official status Under Review and the five application stages."
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption>Public job page and candidate status · sample data</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="home-how" aria-labelledby="how-title">
          <div className="home-shell">
            <h2 id="how-title" className="home-section-title">
              How it works
            </h2>

            <ol className="home-steps">
              <li className="home-step">
                <span className="home-step-index">01</span>
                <h3>Publish a job</h3>
                <p>
                  Create the posting, approve its rubric and share the public link. Applications arrive in one
                  inbox.
                </p>
              </li>
              <li className="home-step">
                <span className="home-step-index">02</span>
                <h3>Review applications</h3>
                <p>
                  See the CV evidence behind each matching score, add notes and save a scorecard. Only a
                  recruiter changes the official status.
                </p>
              </li>
              <li className="home-step">
                <span className="home-step-index">03</span>
                <h3>Keep candidates updated</h3>
                <p>
                  Candidates check their official status through a time-limited link. Internal notes and
                  scorecards stay internal.
                </p>
              </li>
            </ol>

            <div className="home-cta">
              <Button variant="contained" component={RouterLink} to="/gallery">
                Explore demo
              </Button>
              <p>Open the interactive prototype with sample data.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-shell home-footer-inner">
          <div>
            <div className="home-wordmark" style={{ fontSize: 16 }}>
              miniTA
            </div>
            <p>Interactive prototype · Sample data</p>
          </div>
          <nav aria-label="Footer">
            <RouterLink to="/screens/SCR-01">Sign in</RouterLink>
            <RouterLink to="/gallery">Explore demo</RouterLink>
          </nav>
        </div>
      </footer>
    </div>
  );
}
