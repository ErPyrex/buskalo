import os
from django.core.exceptions import ValidationError

def validate_file_size(value):
    if not value:
        return value
    filesize = value.size
    
    # 5MB limit
    if filesize > 5 * 1024 * 1024:
        raise ValidationError("The maximum file size that can be uploaded is 5MB")
    return value

def validate_image_extension(value):
    if not value or not hasattr(value, 'name'):
        return value
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.webp']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension. Allowed: jpg, jpeg, png, webp')
    return value
