import re

def clean_text(text: str) -> str:
    """
    Clean and normalize resume / JD text for NLP processing
    """

    if not text:
        return ""

    # Convert to lowercase
    text = text.lower()

    # Replace special PDF characters
    text = text.replace("\n", " ").replace("\t", " ")

    # Remove punctuation but keep + for skills like c++
    text = re.sub(r"[^a-z0-9+\s]", " ", text)

    # Normalize multiple spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()
