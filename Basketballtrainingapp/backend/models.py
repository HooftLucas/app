class Oefening:
    def __init__(self, titel, doelgroep, duur, thema, beschrijving):
        self.titel = titel
        self.doelgroep = doelgroep
        self.duur = duur
        self.thema = thema
        self.beschrijving = beschrijving

    def to_dict(self):
        return {
            "titel": self.titel,
            "doelgroep": self.doelgroep,
            "duur": self.duur,
            "thema": self.thema,
            "beschrijving": self.beschrijving,
        }
