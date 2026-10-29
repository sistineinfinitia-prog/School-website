from html.parser import HTMLParser

class Validator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.errors = []
        
    def handle_starttag(self, tag, attrs):
        if tag not in ['br', 'hr', 'img', 'input', 'link', 'meta']:
            self.tags.append(tag)
            
    def handle_endtag(self, tag):
        if tag not in ['br', 'hr', 'img', 'input', 'link', 'meta']:
            if self.tags and self.tags[-1] == tag:
                self.tags.pop()
            else:
                expected = self.tags[-1] if self.tags else 'None'
                self.errors.append(f'Mismatched tag: expected {expected}, got {tag}')

for p in ['pages/curriculum.html']:
    v = Validator()
    with open('github repo/' + p, 'r', encoding='utf-8') as f:
        v.feed(f.read())
    print(p, 'Unclosed tags count:', len(v.tags), 'Errors count:', len(v.errors))
    if v.errors:
        print('Sample errors:', v.errors[:5])
