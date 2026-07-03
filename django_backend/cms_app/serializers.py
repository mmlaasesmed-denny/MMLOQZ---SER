from rest_framework import serializers
from .models import WebsiteLayout, DynamicPage, PageFieldBlock, CMSPage, PageTextBlock, PageImageBlock, PageButtonAction

# --- Original Nest ---
class WebsiteLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteLayout
        fields = ['id', 'title', 'sections', 'theme', 'created_at', 'updated_at']


# --- Approach B Serializers ---
class PageFieldBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageFieldBlock
        fields = ['id', 'block_type', 'sort_order', 'data']

class DynamicPageSerializer(serializers.ModelSerializer):
    blocks = PageFieldBlockSerializer(many=True, read_only=True)

    class Meta:
        model = DynamicPage
        fields = ['id', 'title', 'slug', 'blocks', 'created_at']


# --- Approach C: Relational Multi-Model CMS Serializers ---
class PageTextBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageTextBlock
        fields = ['id', 'content', 'font_size', 'font_weight', 'text_align', 'color', 'sort_order']


class PageImageBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageImageBlock
        fields = ['id', 'image_url', 'alt_text', 'border_radius', 'sort_order']


class PageButtonActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageButtonAction
        fields = ['id', 'label', 'destination_url', 'bg_color', 'text_color', 'font_size', 'sort_order']


class CMSPageDetailSerializer(serializers.ModelSerializer):
    """
    Combines three separate SQL tables into an ordered visual outline.
    Queries text, images, and button actions related to this page, and merges them.
    """
    text_blocks = PageTextBlockSerializer(many=True, read_only=True)
    image_blocks = PageImageBlockSerializer(many=True, read_only=True)
    button_blocks = PageButtonActionSerializer(many=True, read_only=True)
    elements_sequenced = serializers.SerializerMethodField()

    class Meta:
        model = CMSPage
        fields = [
            'id', 'title', 'slug', 'description', 
            'text_blocks', 'image_blocks', 'button_blocks', 
            'elements_sequenced', 'created_at', 'updated_at'
        ]

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and 'elements_sequenced' in request.data:
            elements = request.data['elements_sequenced']
            
            # Clear old elements
            instance.text_blocks.all().delete()
            instance.image_blocks.all().delete()
            instance.button_blocks.all().delete()
            
            # Recreate updated fields with order preserved
            for idx, item in enumerate(elements):
                item_type = item.get('type')
                styles = item.get('styles', {})
                if item_type == 'text':
                    PageTextBlock.objects.create(
                        page=instance,
                        content=item.get('content') or '',
                        font_size=styles.get('fontSize') or '16px',
                        font_weight=styles.get('fontWeight') or '400',
                        text_align=styles.get('textAlign') or 'left',
                        color=styles.get('color') or '#0F172A',
                        sort_order=idx
                    )
                elif item_type == 'image':
                    PageImageBlock.objects.create(
                        page=instance,
                        image_url=item.get('src') or item.get('image_url') or '',
                        alt_text=item.get('alt') or item.get('alt_text') or '',
                        border_radius=styles.get('borderRadius') or '8px',
                        sort_order=idx
                    )
                elif item_type == 'button':
                    PageButtonAction.objects.create(
                        page=instance,
                        label=item.get('content') or item.get('label') or 'Button',
                        destination_url=item.get('link') or item.get('destination_url') or '#',
                        bg_color=styles.get('backgroundColor') or '#4F46E5',
                        text_color=styles.get('color') or '#FFFFFF',
                        font_size=styles.get('fontSize') or '14px',
                        sort_order=idx
                    )
                    
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance

    def get_elements_sequenced(self, obj):
        """
        Sorts the fields from all related models together by sort_order.
        """
        elements = []
        for block in obj.text_blocks.all():
            elements.append({
                'id': f"text-{block.id}",
                'type': 'text',
                'sort_order': block.sort_order,
                'content': block.content,
                'styles': {
                    'fontSize': block.font_size,
                    'fontWeight': block.font_weight,
                    'textAlign': block.text_align,
                    'color': block.color
                }
            })
        for block in obj.image_blocks.all():
            elements.append({
                'id': f"image-{block.id}",
                'type': 'image',
                'sort_order': block.sort_order,
                'src': block.image_url,
                'alt': block.alt_text,
                'styles': {
                    'borderRadius': block.border_radius
                }
            })
        for block in obj.button_blocks.all():
            elements.append({
                'id': f"button-{block.id}",
                'type': 'button',
                'sort_order': block.sort_order,
                'content': block.label,
                'link': block.destination_url,
                'styles': {
                    'backgroundColor': block.bg_color,
                    'color': block.text_color,
                    'fontSize': block.font_size
                }
            })
        
        # Sort sequentially by sort_order
        elements.sort(key=lambda x: x['sort_order'])
        return elements
