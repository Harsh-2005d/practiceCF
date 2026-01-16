<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Codeforces Revision Tracker</h3>

  <p align="center">
    A full-stack web application to help you systematically revise your Codeforces problems using spaced repetition (1-day, 7-day, and 30-day lookbacks).
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    &middot;
    <a href="https://github.com/github_username/repo_name/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/github_username/repo_name/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This project is designed to solve a common competitive programming problem: **you solve problems, but you forget them**.

The Codeforces Revision Tracker automatically syncs your solved problems from Codeforces and organizes them into revision buckets:
- **1-day**
- **7-day**
- **30-day**

This allows you to revisit past problems at optimal intervals using a spaced-repetition-style workflow.

The application uses Google OAuth for authentication, stores user and problem metadata in PostgreSQL, and provides a clean React frontend powered by an Express backend.

**Key Features:**
- Automatic daily sync of solved problems from Codeforces  
- Secure authentication using Google OAuth  
- Structured revision timelines (1/7/30 days)  
- PostgreSQL-backed persistence  
- Scalable, modular backend architecture  
- Clean, responsive frontend UI  

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React.js]][React-url]
* [![Node.js][Node.js]][Node-url]
* [![Express][Express.js]][Express-url]
* [![PostgreSQL][Postgres]][Postgres-url]
* [![Google][Google]][Google-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Follow these steps to get a local copy of the project up and running.

### Prerequisites

You will need the following installed:

* Node.js (v18+ recommended)
* npm
  ```sh
  npm install npm@latest -g

