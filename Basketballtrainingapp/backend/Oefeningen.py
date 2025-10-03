from dataclasses import dataclass
from typing import List

@dataclass
class Oefening:
    naam: str
    tijd: str
    teaching_points: List[str]
    omschrijving: str
    tekening: str  # URL/pad naar de tekening
    id: int = None