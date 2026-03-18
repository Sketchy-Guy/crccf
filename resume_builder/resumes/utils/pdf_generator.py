"""PDF generation helpers for resume exports."""

from pathlib import Path
import io

from django.conf import settings
import pikepdf
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer

from resumes.models import Resume


def build_pdf_password(resume: Resume) -> str:
    """Generate the user-visible PDF password from first name and DOB."""
    first_name = resume.full_name.strip().split(" ")[0]
    return f"{first_name}-{resume.dob.strftime('%d%m%Y')}"


def _section_title(title: str, styles) -> Paragraph:
    """Return a formatted section heading."""
    return Paragraph(title, styles["SectionTitle"])


def _safe_lines(items, formatter):
    """Convert optional lists into PDF-safe strings."""
    return [formatter(item) for item in items or []]


def _format_experience(item: dict) -> str:
    """Format one experience entry for the PDF."""
    return (
        f"<b>{item.get('role', 'Role')}</b> | {item.get('company', 'Company')} | "
        f"{item.get('duration', 'Duration')}<br/>{item.get('description', '')}"
    )


def _format_education(item: dict) -> str:
    """Format one education entry for the PDF."""
    return (
        f"<b>{item.get('degree', 'Degree')}</b> | {item.get('institution', 'Institution')} | "
        f"{item.get('year', 'Year')} | {item.get('grade', '')}"
    )


def _format_project(item: dict) -> str:
    """Format one project entry for the PDF."""
    return (
        f"<b>{item.get('title', 'Project')}</b> | {item.get('tech_stack', '')}<br/>"
        f"{item.get('description', '')}<br/>{item.get('link', '')}"
    )


def _build_story(resume: Resume):
    """Build the PDF flowables for the resume document."""
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="HeaderName",
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#0D1B2A"),
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionTitle",
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=14,
            textColor=colors.HexColor("#C9A84C"),
            spaceBefore=10,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyTextTight",
            parent=styles["BodyText"],
            fontSize=10,
            leading=14,
            spaceAfter=6,
        )
    )

    story = [
        Paragraph(resume.full_name, styles["HeaderName"]),
        Paragraph(
            f"{resume.email} | {resume.phone} | DOB: {resume.dob.strftime('%d %b %Y')}",
            styles["BodyTextTight"],
        ),
        HRFlowable(color=colors.HexColor("#C9A84C"), thickness=1, width="100%"),
        Spacer(1, 6),
    ]

    if resume.summary:
        story.extend([_section_title("Professional Summary", styles), Paragraph(resume.summary, styles["BodyTextTight"])])

    if resume.experience:
        story.append(_section_title("Experience", styles))
        story.extend(Paragraph(text, styles["BodyTextTight"]) for text in _safe_lines(resume.experience, _format_experience))

    if resume.education:
        story.append(_section_title("Education", styles))
        story.extend(Paragraph(text, styles["BodyTextTight"]) for text in _safe_lines(resume.education, _format_education))

    if resume.skills:
        story.extend([
            _section_title("Skills", styles),
            Paragraph(", ".join([str(skill) for skill in resume.skills]), styles["BodyTextTight"]),
        ])

    if resume.projects:
        story.append(_section_title("Projects", styles))
        story.extend(Paragraph(text, styles["BodyTextTight"]) for text in _safe_lines(resume.projects, _format_project))

    story.append(Spacer(1, 10 * mm))
    return story


def generate_resume_pdf(resume: Resume, enable_password_protection: bool = True) -> tuple[str, str]:
    """Generate a formatted PDF and optionally password-protect it."""
    pdf_directory = Path(settings.MEDIA_ROOT) / "pdfs"
    pdf_directory.mkdir(parents=True, exist_ok=True)
    pdf_path = pdf_directory / f"{resume.resume_id}.pdf"

    buffer = io.BytesIO()
    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
    )
    document.build(_build_story(resume))

    with open(pdf_path, "wb") as output_file:
        output_file.write(buffer.getvalue())

    password = build_pdf_password(resume)
    if enable_password_protection:
        with pikepdf.open(str(pdf_path), allow_overwriting_input=True) as pdf_file:
            pdf_file.save(
                str(pdf_path),
                encryption=pikepdf.Encryption(user=password, owner=password, R=4),
            )

    return str(pdf_path), password
