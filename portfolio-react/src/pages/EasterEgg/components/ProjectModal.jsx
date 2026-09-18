const TECH_COLORS = {
  'React': '#61dafb',
  'Node.js': '#68a063',
  'JavaScript': '#f7df1e',
  'TypeScript': '#3178c6',
  'Kotlin': '#7f52ff',
  'Python': '#3776ab',
  'Firebase': '#ffca28',
  'HTML5': '#e34f26',
  'CSS3': '#1572b6',
  'PostgreSQL': '#336791',
  'Android': '#3ddc84',
  'Jetpack Compose': '#4285f4',
  'Docker': '#2496ed',
  'OpenCV': '#5c3ee8',
  'MediaPipe': '#0097a7',
  'Pygame': '#00cc44',
  'Pandas': '#150458',
  'REST APIs': '#666666',
}

export default function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <div className="ee-modal-overlay" onClick={onClose}>
      <div className="ee-modal-card" onClick={e => e.stopPropagation()}>
        <button className="ee-modal-close" onClick={onClose}>×</button>
        <div className="ee-modal-header">Project Details:</div>
        <h2 className="ee-modal-title">{project.title}</h2>
        <p className="ee-modal-desc">{project.desc}</p>

        {project.tech && project.tech.length > 0 && (
          <div className="ee-modal-tech">
            <div className="ee-modal-tech__label">Tech Stack</div>
            <div className="ee-modal-tech__badges">
              {project.tech.map(t => (
                <span key={t} className="ee-tech-badge">
                  <span
                    className="ee-tech-badge__dot"
                    style={{ background: TECH_COLORS[t] || '#999' }}
                  />
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ee-modal-action"
          >
            Open Project
            <span style={{ fontSize: '0.9em' }}>↗</span>
          </a>
        )}
      </div>
    </div>
  )
}
