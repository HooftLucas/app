class Oefening:
    def __init__(self, titel, doelgroep, duur, thema, beschrijving, teaching_points=None):
        self.titel = titel
        self.doelgroep = doelgroep
        self.duur = duur
        self.thema = thema
        self.beschrijving = beschrijving
        self.teaching_points = teaching_points or []
        self.id = None

    def to_dict(self):
        return {
            "id": self.id,
            "titel": self.titel,
            "doelgroep": self.doelgroep,
            "duur": self.duur,
            "thema": self.thema,
            "beschrijving": self.beschrijving,
            "teaching_points": self.teaching_points
        }