import { useEffect, useState } from "react";
import FaultyTerminal from "./FaultyTerminal";

const projects = [
    {
    name: "ctf-ad-agents",
    description:
      "Multi-agent AI assistant that helps operators analyse traffic, patch vulnerable services and manage exploit workflows with human approval for risky actions.",
    stack: "Python - LangGraph - MCP - Kubernetes",
    href: "https://github.com/SimoneErrigo/ctf-ad-agents",
  },
  {
    name: "Janus",
    description:
      "Modular reverse proxy and packet sniffer for Attack & Defense CTFs, with traffic inspection and rule-based filtering across HTTP, TCP, TLS, WebSocket and gRPC.",
    stack: "Go - Networking - Security",
    href: "https://github.com/SimoneErrigo/Janus",
  },
  {
    name: "BestBikePaths",
    description:
      "Crowdsourced platform for collecting, validating and visualising bicycle-path information so cyclists can choose safer, better routes.",
    stack: "React - Node.js - PostgreSQL - Prisma",
    href: "https://github.com/BIA3IA/Software-Engineering-2",
  },
  {
    name: "Galaxy Trucker",
    description:
      "Distributed multiplayer implementation of the board game, with CLI and JavaFX clients, concurrent networking and support for reconnections.",
    stack: "Java - JavaFX - RMI - TCP Sockets - MVC",
    href: "https://github.com/https://github.com/AlessandroNicolov124/ing-sw-2025-Nicolov-Errigo-Roggi-Galimberti",
  },
  {
    name: "Distributed Group Chat",
    description:
      "Peer-to-peer group chat with causal message ordering, reliable delivery and consistency across temporary disconnections.",
    stack: "Java - Distributed Systems - Vector Clocks - TCP Sockets",
    href: "https://github.com/Politecnico-Di-Milano-CSE/Causally-Ordered-Group-Chat",
  },
];

function TypingLogo() {
  const text = "Welcome, I'm Simone";
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (length === text.length) return;
    const timer = window.setTimeout(() => setLength(length + 1), 70);
    return () => window.clearTimeout(timer);
  }, [length]);

  return (
    <span aria-label={text}>
      {text.slice(0, length)}
      <span className="cursor" aria-hidden="true">_</span>
    </span>
  );
}

export default function App() {

  return (
    <>
      <div className="background" aria-hidden="true">
        <FaultyTerminal />
      </div>

      <header>
        <a className="logo" href="#top" aria-label="Back to top">
          <TypingLogo />
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="./simone-errigo-cv.pdf" target="_blank">
            CV
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">
            <span className="status" /> {"Perugia <--> Milan - Available to learn"}
          </p>
          <h1>
            <span>Simone</span>
            <span>Errigo</span>
          </h1>
          <div className="hero-bottom">
            <p className="intro">
              I build software where <strong>engineering</strong>,{" "}
              <strong>systems</strong> and <strong>cybersecurity</strong> meet.
              MSc student at Politecnico di Milano and CyberChallenge.IT
              instructor.
            </p>
            <div className="actions">
              <a className="button primary" href="./simone-errigo-cv.pdf" target="_blank">
                View my CV
              </a>
              <a className="button" href="https://github.com/SimoneErrigo" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="section split">
          <div>
            <p className="label">01 / About</p>
            <h2>Learning by building things that can break.</h2>
          </div>
          <div className="about-copy">
            <p>
              I am a Computer Science and Engineering master&apos;s student with
              a practical interest in software engineering, distributed systems
              and offensive security.
            </p>
            <p>
              Since 2023 I have taught web security, secure development and
              cryptography as an instructor for CyberChallenge.IT. Previously, I
              developed vulnerable applications for cyber-range training during
              an internship at Cybertech.
            </p>
            <p>
              My bachelor&apos;s thesis focused on building an Active Directory
              lab to reproduce known vulnerabilities. Today I compete in CTFs
              and build tools that make security work faster and more observable.
            </p>
          </div>
        </section>

        <section className="section">
          <p className="label">02 / Path</p>
          <div className="timeline">
            <article>
              <time>2023 — now</time>
              <div>
                <h3>CyberChallenge.IT - Instructor</h3>
                <p>Hands-on labs, vulnerable applications, mentoring and CTF exercises.</p>
              </div>
            </article>
            <article>
              <time>2023 — now</time>
              <div>
                <h3>Politecnico di Milano - MSc</h3>
                <p>Computer Science and Engineering.</p>
              </div>
            </article>
            <article>
              <time>2023</time>
              <div>
                <h3>Cybertech - Web Developer Intern</h3>
                <p>Containerised vulnerable web applications for cybersecurity training.</p>
              </div>
            </article>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-heading">
            <div>
              <p className="label">03 / Selected projects</p>
              <h2>Things I&apos;ve developed.</h2>
            </div>
            <a href="https://github.com/SimoneErrigo?tab=repositories" target="_blank" rel="noreferrer">
              All repositories
            </a>
          </div>

          <div className="projects">
            {projects.map((project, index) => (
              <a
                className="project"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                key={project.name}
              >
                <span className="number">0{index + 1}</span>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <span className="stack">{project.stack}</span>
                </div>
                <span className="arrow" aria-hidden="true"></span>
              </a>
            ))}
          </div>
        </section>

        <section className="contact section">
          <p className="label">04 / Contact</p>
          <h2>Have an interesting problem?</h2>
          <a href="mailto:errigosimonee@gmail.com">errigosimonee@gmail.com</a>
        </section>
      </main>

      <footer>
        <span>© 2026 Simone Errigo</span>
        <a href="https://linkedin.com/in/simone-errigo" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </footer>
    </>
  );
}
