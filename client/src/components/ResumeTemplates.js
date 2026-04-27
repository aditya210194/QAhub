// client/src/components/ResumeTemplates.js
import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarker, FaLinkedin, FaGithub, FaGlobe, FaCode, FaAward, FaBriefcase, FaGraduationCap } from 'react-icons/fa';

// ==================== TEMPLATE 1: CLASSIC PROFESSIONAL ====================
export const ClassicProfessional = ({ data, colors, isDark }) => {
    const styles = {
        container: {
            backgroundColor: isDark ? '#1a202c' : '#ffffff',
            color: isDark ? '#e2e8f0' : '#2d3748',
            fontFamily: "'Times New Roman', Georgia, serif",
            maxWidth: '210mm',
            margin: '0 auto',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        },
        header: { textAlign: 'center', marginBottom: '1.5rem', borderBottom: `2px solid ${colors.primary}`, paddingBottom: '1rem' },
        name: { fontSize: '2.2rem', fontWeight: 'bold', color: colors.primary, marginBottom: '0.25rem' },
        title: { fontSize: '1rem', color: colors.secondary, marginBottom: '0.5rem' },
        contactRow: { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem' },
        sectionTitle: { fontSize: '1.2rem', fontWeight: 'bold', color: colors.primary, marginTop: '1.2rem', marginBottom: '0.8rem', borderBottom: `1px solid ${colors.accent}`, paddingBottom: '0.25rem' },
        skillBadge: { display: 'inline-block', background: isDark ? '#2d3748' : '#edf2f7', padding: '0.2rem 0.6rem', margin: '0.2rem', borderRadius: '4px', fontSize: '0.8rem' }
    };
    return <BaseTemplate data={data} styles={styles} colors={colors} />;
};

// ==================== TEMPLATE 2: MODERN MINIMAL ====================
export const ModernMinimal = ({ data, colors, isDark }) => {
    const styles = {
        container: {
            backgroundColor: isDark ? '#0f172a' : '#fafafa',
            color: isDark ? '#e2e8f0' : '#334155',
            fontFamily: "'Inter', -apple-system, sans-serif",
            maxWidth: '210mm',
            margin: '0 auto',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        },
        header: { marginBottom: '2rem' },
        name: { fontSize: '2.5rem', fontWeight: '800', background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.25rem' },
        title: { fontSize: '1.1rem', color: colors.secondary, fontWeight: '500' },
        contactRow: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '0.85rem' },
        sectionTitle: { fontSize: '1rem', fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '1.5rem', marginBottom: '1rem' },
        skillBadge: { display: 'inline-block', background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`, color: colors.primary, padding: '0.3rem 0.8rem', margin: '0.25rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }
    };
    return <BaseTemplate data={data} styles={styles} colors={colors} />;
};

// ==================== TEMPLATE 3: SIDEBAR LAYOUT ====================
export const SidebarLayout = ({ data, colors, isDark }) => {
    const styles = {
        container: {
            backgroundColor: isDark ? '#1a202c' : '#ffffff',
            color: isDark ? '#e2e8f0' : '#2d3748',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            maxWidth: '210mm',
            margin: '0 auto',
            display: 'flex',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        },
        sidebar: {
            width: '33%',
            backgroundColor: colors.primary,
            color: 'white',
            padding: '1.5rem'
        },
        main: {
            width: '67%',
            padding: '1.5rem',
            backgroundColor: isDark ? '#1a202c' : '#ffffff'
        },
        name: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' },
        title: { fontSize: '0.9rem', opacity: 0.9, marginBottom: '1rem' },
        sectionTitle: { fontSize: '1rem', fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem', borderBottom: `2px solid ${colors.accent}`, paddingBottom: '0.25rem', display: 'inline-block' },
        skillBadge: { display: 'block', padding: '0.2rem 0', fontSize: '0.8rem' }
    };
    return <SidebarBaseTemplate data={data} styles={styles} colors={colors} />;
};

// ==================== TEMPLATE 4: CREATIVE DESIGNER ====================
export const CreativeDesigner = ({ data, colors, isDark }) => {
    const styles = {
        container: {
            backgroundColor: isDark ? '#1a1a2e' : '#fff5f0',
            color: isDark ? '#e2e8f0' : '#2d3748',
            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
            maxWidth: '210mm',
            margin: '0 auto',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            position: 'relative'
        },
        header: { textAlign: 'center', marginBottom: '2rem', position: 'relative' },
        name: { fontSize: '2.8rem', fontWeight: '800', background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' },
        title: { fontSize: '1.2rem', color: colors.secondary, fontStyle: 'italic' },
        contactRow: { display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' },
        sectionTitle: { fontSize: '1.3rem', fontWeight: '700', color: colors.primary, marginTop: '1.5rem', marginBottom: '1rem', display: 'inline-block', borderBottom: `3px dotted ${colors.accent}` },
        skillBadge: { display: 'inline-block', background: `linear-gradient(135deg, ${colors.primary}15, ${colors.accent}15)`, border: `1px solid ${colors.accent}`, padding: '0.3rem 0.8rem', margin: '0.25rem', borderRadius: '25px', fontSize: '0.8rem' }
    };
    return <BaseTemplate data={data} styles={styles} colors={colors} />;
};

// ==================== TEMPLATE 5: TECH FOCUSED ====================
export const TechFocused = ({ data, colors, isDark }) => {
    const styles = {
        container: {
            backgroundColor: isDark ? '#0d1117' : '#0a0e27',
            color: isDark ? '#c9d1d9' : '#e6e6e6',
            fontFamily: "'Fira Code', 'Courier New', monospace",
            maxWidth: '210mm',
            margin: '0 auto',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        },
        header: { textAlign: 'center', marginBottom: '1.5rem' },
        name: { fontSize: '2rem', fontWeight: '700', color: '#00ff88', marginBottom: '0.25rem' },
        title: { fontSize: '0.9rem', color: '#58a6ff' },
        contactRow: { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', fontFamily: 'monospace' },
        sectionTitle: { fontSize: '1rem', fontWeight: 'bold', color: '#00ff88', marginTop: '1.5rem', marginBottom: '0.8rem', borderLeft: `3px solid #00ff88`, paddingLeft: '0.5rem' },
        skillBadge: { display: 'inline-block', background: '#1f1f2e', border: '1px solid #30363d', padding: '0.2rem 0.6rem', margin: '0.2rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace' }
    };
    return <BaseTemplate data={data} styles={styles} colors={colors} />;
};

// ==================== TEMPLATE 6: EXECUTIVE ELEGANT ====================
export const ExecutiveElegant = ({ data, colors, isDark }) => {
    const styles = {
        container: {
            backgroundColor: isDark ? '#1e293b' : '#f8f9fa',
            color: isDark ? '#e2e8f0' : '#1e293b',
            fontFamily: "'Playfair Display', 'Georgia', serif",
            maxWidth: '210mm',
            margin: '0 auto',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        },
        header: { textAlign: 'center', marginBottom: '1.5rem' },
        name: { fontSize: '2.2rem', fontWeight: '700', color: colors.primary, letterSpacing: '2px', marginBottom: '0.25rem' },
        title: { fontSize: '1rem', color: colors.secondary, letterSpacing: '1px' },
        contactRow: { display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem' },
        sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: colors.primary, marginTop: '1.5rem', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '3px' },
        skillBadge: { display: 'inline-block', background: isDark ? '#2d3748' : '#e2e8f0', padding: '0.2rem 0.8rem', margin: '0.2rem', borderRadius: '0', fontSize: '0.8rem' }
    };
    return <BaseTemplate data={data} styles={styles} colors={colors} />;
};

// ==================== TEMPLATE 7: ACADEMIC ====================
export const Academic = ({ data, colors, isDark }) => {
    const styles = {
        container: {
            backgroundColor: isDark ? '#2d1b4e' : '#fdfbf7',
            color: isDark ? '#e2e8f0' : '#2d3748',
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            maxWidth: '210mm',
            margin: '0 auto',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        },
        header: { textAlign: 'center', marginBottom: '1.5rem' },
        name: { fontSize: '2rem', fontWeight: '600', color: colors.primary, marginBottom: '0.25rem' },
        title: { fontSize: '1rem', color: colors.secondary, fontStyle: 'italic' },
        contactRow: { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem' },
        sectionTitle: { fontSize: '1.2rem', fontWeight: '600', color: colors.primary, marginTop: '1.2rem', marginBottom: '0.5rem', borderBottom: `1px solid ${colors.accent}` },
        skillBadge: { display: 'inline-block', background: isDark ? '#3d2b5e' : '#e8e0d5', padding: '0.2rem 0.6rem', margin: '0.2rem', borderRadius: '4px', fontSize: '0.8rem' }
    };
    return <BaseTemplate data={data} styles={styles} colors={colors} />;
};

// ==================== TEMPLATE 8: STARTUP MODERN ====================
export const StartupModern = ({ data, colors, isDark }) => {
    const styles = {
        container: {
            backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
            color: isDark ? '#e2e8f0' : '#2d3748',
            fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
            maxWidth: '210mm',
            margin: '0 auto',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: '16px'
        },
        header: { marginBottom: '1.5rem' },
        name: { fontSize: '2.2rem', fontWeight: '700', background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.25rem' },
        title: { fontSize: '1rem', color: colors.secondary, fontWeight: '500' },
        contactRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.8rem' },
        sectionTitle: { fontSize: '1rem', fontWeight: '700', color: colors.primary, textTransform: 'uppercase', marginTop: '1.2rem', marginBottom: '0.8rem', letterSpacing: '1px' },
        skillBadge: { display: 'inline-block', background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`, color: colors.primary, padding: '0.25rem 0.8rem', margin: '0.25rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500' }
    };
    return <BaseTemplate data={data} styles={styles} colors={colors} />;
};

// ==================== BASE TEMPLATE COMPONENTS ====================
const BaseTemplate = ({ data, styles, colors }) => {
    const renderContact = () => (
        <div style={styles.contactRow}>
            {data.email && <span><FaEnvelope /> {data.email}</span>}
            {data.phone && <span><FaPhone /> {data.phone}</span>}
            {data.location && <span><FaMapMarker /> {data.location}</span>}
            {data.linkedin && <span><FaLinkedin /> {data.linkedin}</span>}
            {data.github && <span><FaGithub /> {data.github}</span>}
        </div>
    );

    const renderSection = (title, icon, content, condition) => {
        if (!condition) return null;
        return (
            <>
                <h3 style={styles.sectionTitle}>{icon} {title}</h3>
                {content}
            </>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.name}>{data.name || "Your Name"}</div>
                {data.title && <div style={styles.title}>{data.title}</div>}
                {renderContact()}
            </div>

            {renderSection("Professional Summary", "📋", <p>{data.summary}</p>, data.summary)}

            {renderSection("Work Experience", <FaBriefcase />,
                data.experience?.filter(e => e.company).map((exp, i) => (
                    <div key={i} style={{ marginBottom: '1rem' }}>
                        <div><strong>{exp.position}</strong> @ {exp.company}</div>
                        <div style={{ fontSize: '0.8rem', color: styles.contactRow.color }}>{exp.duration}</div>
                        <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{exp.responsibilities}</div>
                    </div>
                )),
                data.experience?.some(e => e.company)
            )}

            {renderSection("Education", <FaGraduationCap />,
                data.education?.filter(e => e.institution).map((edu, i) => (
                    <div key={i} style={{ marginBottom: '0.5rem' }}>
                        <strong>{edu.degree}</strong> - {edu.institution}
                        {edu.duration && <div style={{ fontSize: '0.8rem' }}>{edu.duration}</div>}
                    </div>
                )),
                data.education?.some(e => e.institution)
            )}

            {renderSection("Technical Skills", "💻",
                <div>
                    {data.skills?.map((skill, i) => (
                        <span key={i} style={styles.skillBadge}>{skill}</span>
                    ))}
                </div>,
                data.skills?.length > 0
            )}

            {renderSection("Certifications", "🎓",
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {data.certifications?.map((cert, i) => <li key={i}>{cert}</li>)}
                </ul>,
                data.certifications?.length > 0
            )}

            {renderSection("Projects", <FaCode />,
                data.projects?.filter(p => p.title).map((proj, i) => (
                    <div key={i} style={{ marginBottom: '0.75rem' }}>
                        <strong>{proj.title}</strong> {proj.technologies && `- ${proj.technologies}`}
                        <div style={{ fontSize: '0.85rem' }}>{proj.description}</div>
                    </div>
                )),
                data.projects?.some(p => p.title)
            )}

            {renderSection("Achievements", <FaAward />, <p>{data.achievements}</p>, data.achievements)}
        </div>
    );
};

const SidebarBaseTemplate = ({ data, styles, colors }) => {
    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.name}>{data.name || "Your Name"}</div>
                {data.title && <div style={styles.title}>{data.title}</div>}
                <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <div><FaEnvelope /> {data.email || "email@example.com"}</div>
                <div><FaPhone /> {data.phone || "+1 234 567 890"}</div>
                {data.location && <div><FaMapMarker /> {data.location}</div>}
                {data.linkedin && <div><FaLinkedin /> {data.linkedin}</div>}
                <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <div><strong>Skills</strong></div>
                {data.skills?.map((skill, i) => <div key={i} style={styles.skillBadge}>• {skill}</div>)}
            </div>
            <div style={styles.main}>
                {data.summary && <><h3 style={styles.sectionTitle}>Summary</h3><p>{data.summary}</p></>}
                {data.experience?.some(e => e.company) && <h3 style={styles.sectionTitle}>Experience</h3>}
                {data.experience?.filter(e => e.company).map((exp, i) => (
                    <div key={i}><strong>{exp.position}</strong> @ {exp.company}<br />{exp.duration}<p>{exp.responsibilities}</p></div>
                ))}
                {data.education?.some(e => e.institution) && <h3 style={styles.sectionTitle}>Education</h3>}
                {data.education?.filter(e => e.institution).map((edu, i) => (
                    <div key={i}><strong>{edu.degree}</strong> - {edu.institution}<br />{edu.duration}</div>
                ))}
            </div>
        </div>
    );
};

// ==================== TEMPLATE SELECTOR COMPONENT ====================
export const TemplateSelector = ({ currentTemplate, onSelectTemplate }) => {
    const templates = [
        { id: 'classic', name: 'Classic Professional', icon: '📄', component: ClassicProfessional },
        { id: 'modern', name: 'Modern Minimal', icon: '✨', component: ModernMinimal },
        { id: 'sidebar', name: 'Sidebar Layout', icon: '📑', component: SidebarLayout },
        { id: 'creative', name: 'Creative Designer', icon: '🎨', component: CreativeDesigner },
        { id: 'tech', name: 'Tech Focused', icon: '💻', component: TechFocused },
        { id: 'executive', name: 'Executive Elegant', icon: '👔', component: ExecutiveElegant },
        { id: 'academic', name: 'Academic', icon: '🎓', component: Academic },
        { id: 'startup', name: 'Startup Modern', icon: '🚀', component: StartupModern }
    ];

    return (
        <div className="template-selector-grid">
            <h4 className="mb-3">Choose Your Template</h4>
            <div className="row g-3">
                {templates.map((template) => (
                    <div key={template.id} className="col-md-3 col-sm-6">
                        <div
                            className={`template-card ${currentTemplate === template.id ? 'active' : ''}`}
                            onClick={() => onSelectTemplate(template.id)}
                        >
                            <div className="template-icon">{template.icon}</div>
                            <div className="template-name">{template.name}</div>
                            {currentTemplate === template.id && <div className="template-check">✓</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================
const ResumeTemplates = ({ data, template, theme, layout }) => {
    const getColors = () => {
        const templates = {
            classic: { primary: '#1a365d', secondary: '#2c5282', accent: '#3182ce' },
            modern: { primary: '#22543d', secondary: '#276749', accent: '#38a169' },
            sidebar: { primary: '#2c3e50', secondary: '#34495e', accent: '#3498db' },
            creative: { primary: '#c0392b', secondary: '#e74c3c', accent: '#f39c12' },
            tech: { primary: '#00ff88', secondary: '#58a6ff', accent: '#ff7b72' },
            executive: { primary: '#1a202c', secondary: '#2d3748', accent: '#4a5568' },
            academic: { primary: '#553c9a', secondary: '#6b46c1', accent: '#805ad5' },
            startup: { primary: '#dd6b20', secondary: '#ed8936', accent: '#f6ad55' }
        };
        return templates[template] || templates.classic;
    };

    const colors = getColors();
    const isDark = theme === 'dark';

    const renderTemplate = () => {
        switch(template) {
            case 'classic': return <ClassicProfessional data={data} colors={colors} isDark={isDark} />;
            case 'modern': return <ModernMinimal data={data} colors={colors} isDark={isDark} />;
            case 'sidebar': return <SidebarLayout data={data} colors={colors} isDark={isDark} />;
            case 'creative': return <CreativeDesigner data={data} colors={colors} isDark={isDark} />;
            case 'tech': return <TechFocused data={data} colors={colors} isDark={isDark} />;
            case 'executive': return <ExecutiveElegant data={data} colors={colors} isDark={isDark} />;
            case 'academic': return <Academic data={data} colors={colors} isDark={isDark} />;
            case 'startup': return <StartupModern data={data} colors={colors} isDark={isDark} />;
            default: return <ClassicProfessional data={data} colors={colors} isDark={isDark} />;
        }
    };

    return renderTemplate();
};

export default ResumeTemplates;