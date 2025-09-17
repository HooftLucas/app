import re

class User: 
    def __init__(self, name, firstname, phonenumber, email, adress, role, password):
        self.name = name
        self.firstname = firstname
        self.phonenumber = phonenumber
        self.email = email
        self.adress = adress
        self.role = role
        self.password = password
    def set_id(self, user_id):
        self.id = user_id
    def get_id(self):
        return self.id
    def get_name(self):
        return self.name
    def get_firstname(self):
        return self.firstname
    def get_phonenumber(self):
        return self.phonenumber
    def get_email(self):
        return self.email
    def get_adress(self):
        return self.adress
    def get_role(self):
        return self.role
    def get_password(self):
        return self.password
    def set_name(self, name):
        self.name = name    
    def set_firstname(self, firstname):
        self.firstname = firstname
    def set_phonenumber(self, phonenumber):
        # Remove spaces and dashes
        number = re.sub(r'[\s\-]', '', phonenumber)
        # If number starts with '+04', replace with '04'
        if number.startswith('+04'):
            number = '04' + number[3:]
        elif number.startswith('+3204'):
            number = '04' + number[5:]
        # Belgian mobile numbers: 04xx xxx xxx or +324xx xxx xxx
        # Accepts 10 digits starting with 04 or 12 digits starting with +324
        if re.fullmatch(r'04\d{8}', number) or re.fullmatch(r'\+324\d{8}', number):
            self.phonenumber = number
        else:
            raise ValueError("Invalid Belgian phone number format")
    def set_email(self, email):
        self.email = email
    def set_adress(self, adress):
        self.adress = adress
    def set_role(self, role):
        self.role = role
    def set_password(self, password):
        self.password = password


# Example usage:
usertest = User("Doe", "John", "+320493129831", "Doe.John@hotmail.com", "123 Main St", "member", 'memberspassword')
print(usertest.get_phonenumber())  # Output: Doe