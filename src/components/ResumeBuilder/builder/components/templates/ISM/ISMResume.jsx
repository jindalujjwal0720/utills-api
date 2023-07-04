import React from "react";
import styles from "./ISMResume.module.css";
import { getSafeMarkdownString } from "../../../../utils/markdown";

const ISMResume = ({ sections }) => {
  return (
    <div className={styles.resume}>
      <Header profile={sections.profile.data} />
      <div className={styles.left}>
        <Experience experience={sections.experience?.data} />
        <Projects projects={sections.projects?.data} />
        <PORs pors={sections.positionsOfResponsibility?.data} />
      </div>
      <div className={styles.right}>
        <Education education={sections.education?.data} />
        <SportsProgramming
          sportsProgramming={sections.sportsProgramming?.data}
        />
        <TechnicalSkills technicalSkills={sections.technicalSkills?.data} />
        <ExtraCurriculars extraCurriculars={sections.extraCurriculars?.data} />
        <Achievements achievements={sections.achievements?.data} />
      </div>
    </div>
  );
};

const Header = ({ profile }) => {
  if (!profile) return null;
  return (
    <div className={styles.header}>
      <div className={styles.user_image}>
        <img src={profile.photo} alt="User" />
      </div>
      <div className={styles.user_details}>
        <h1 className={styles.name}>{profile.name}</h1>
        <h2 className={styles.degree_branch_college}>
          {[profile.degree, profile.branch, profile.college]
            .filter(Boolean)
            .join(" - ")}
        </h2>
        <div className={styles.links_and_info}>
          {profile.admissionNumber && (
            <div className={styles.info}>
              Admission No.: <span>{profile.admissionNumber}</span>
            </div>
          )}
          {profile.email && (
            <div className={styles.link}>
              Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
          )}
          {profile.githubUsername && (
            <div className={styles.link}>
              Github:{" "}
              <a
                href={`
                        https://github.com/${profile.githubUsername}
                    `}
              >
                {profile.githubUsername}
              </a>
            </div>
          )}
          {profile.phone && (
            <div className={styles.info}>
              Contact: <span>{profile.phone}</span>
            </div>
          )}
          {profile.linkedinUsername && (
            <div className={styles.link}>
              LinkedIn:{" "}
              <a
                href={`
                        https://linkedin.com/in/${profile.linkedinUsername}
                    `}
              >
                {profile.linkedinUsername}
              </a>
            </div>
          )}
        </div>
      </div>
      <div className={styles.ism_logo}>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/b/b0/Indian_Institute_of_Technology_%28Indian_School_of_Mines%29%2C_Dhanbad_Logo.png"
          alt="ISM Logo"
        />
      </div>
    </div>
  );
};

const Section = ({ title, children }) => {
  if (!children) return null;
  return (
    <div className={styles.section}>
      <h2>{title}</h2>
      <div className={styles.section_container}>{children}</div>
    </div>
  );
};

const Points = ({ points, markdown = true }) => {
  if (!points) return null;
  return (
    <ul className={styles.points}>
      {points?.map((point, index) =>
        markdown ? (
          <li
            key={index}
            dangerouslySetInnerHTML={{ __html: getSafeMarkdownString(point) }}
          />
        ) : (
          <li key={index}>{point}</li>
        )
      )}
    </ul>
  );
};

const Experience = ({ experience }) => {
  if (!experience || experience.length === 0) return null;
  return (
    <Section title="Experience">
      {experience?.map((exp, index) => (
        <div className={styles.experience} key={index}>
          <h3 className={styles.title}>
            {[exp.company, exp.role, exp.timePeriod]
              .filter(Boolean)
              .join(" - ")}
          </h3>
          {exp.description && <h4>{exp.description}</h4>}
          <Points points={exp.points} markdown={true} />
        </div>
      ))}
    </Section>
  );
};

const Projects = ({ projects }) => {
  if (!projects || projects.length === 0) return null;
  return (
    <Section title="Projects">
      {projects?.map((project, index) => (
        <div className={styles.project} key={index}>
          <h3 className={styles.title}>
            {[project.title, project.platform, project.year]
              .filter(Boolean)
              .join(" - ")}
          </h3>
          {project.description && <h4>{project.description}</h4>}
          <Points points={project.points} />
          {project.techStack && (
            <div className={styles.tech_stack}>
              <span>Tech Stack: </span>
              {project.techStack?.join(", ")}
            </div>
          )}
          <div className={styles.links}>
            {project.links?.map((link, index) => (
              <div className={styles.link} key={index}>
                <span>
                  {link.name}
                  {": "}
                </span>
                <a href={link.url}>{link.urlPlaceholder}</a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
};

const Education = ({ education }) => {
  if (!education || education.length === 0) return null;
  return (
    <Section title="Education">
      {education?.map((education, index) => (
        <div className={styles.education} key={index}>
          <h3 className={styles.college}>{education.college}</h3>
          <h4 className={styles.degree}>
            {education.degree} - {education.branch}
          </h4>
          <div className={styles.year_and_cgpa}>
            {education.year} -{" "}
            <span>
              {education.cgpa
                ? `CGPA: ${education.cgpa}`
                : `${education.percentage}%`}
            </span>
          </div>
        </div>
      ))}
    </Section>
  );
};

const SportsProgramming = ({ sportsProgramming }) => {
  if (!sportsProgramming || sportsProgramming.length === 0) return null;
  return (
    <Section title="Sports Programming">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Username</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {sportsProgramming.map((sport, index) => (
            <tr key={index}>
              <td>{sport.platform}</td>
              <td>
                <a
                  href={sport.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sport.username}
                </a>
              </td>
              <td>{sport.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
};

const TechnicalSkills = ({ technicalSkills }) => {
  if (!technicalSkills || technicalSkills.length === 0) return null;
  return (
    <Section title="Technical Skills">
      <table className={styles.table_left}>
        <tbody>
          {technicalSkills.map((skill, index) => (
            <tr key={index}>
              <td>{skill.name}</td>
              <td>{skill.skills?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
};

const ExtraCurriculars = ({ extraCurriculars }) => {
  if (!extraCurriculars || extraCurriculars.length === 0) return null;
  return (
    <Section title="Extra Curriculars">
      <Points points={extraCurriculars} />
    </Section>
  );
};

const Achievements = ({ achievements }) => {
  if (!achievements || achievements.length === 0) return null;
  return (
    <Section title="Achievements">
      <Points points={achievements} markdown={true} />
    </Section>
  );
};

const PORs = ({ pors }) => {
  if (!pors || pors.length === 0) return null;
  return (
    <Section title="Positions of Responsibility">
      <Points points={pors} markdown={true} />
    </Section>
  );
};

export default ISMResume;
