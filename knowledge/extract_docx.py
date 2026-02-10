
import xml.etree.ElementTree as ET
import sys

def extract_text(xml_file):
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
        
        # XML namespace for Word
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        # Find all text elements
        text_content = []
        for elem in root.iter():
            if elem.tag.endswith('}p'): # paragaph
                para_text = ""
                for child in elem.iter():
                    if child.tag.endswith('}t'):
                        if child.text:
                            para_text += child.text
                if para_text:
                    text_content.append(para_text)
                    
        output_file = xml_file + ".txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(text_content))
        print(f"Extracted to {output_file}")
            
    except Exception as e:
        print(f"Error reading {xml_file}: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        extract_text(sys.argv[1])
