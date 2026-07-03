from django.db import models

# =========================================================================
# APPROACH A: Dynamic Document Schema (Highly Recommended for Page Builders)
# Stores full-stack persistent website designs inside a JSONField.
# Allows a single model to support any arbitrary layout with zero SQL changes.
# =========================================================================
class WebsiteLayout(models.Model):
    title = models.CharField(max_length=255, default="My Custom Layout")
    is_published = models.BooleanField(default=False)
    sections = models.JSONField(
        help_text="Nested JSON array containing section columns, layouts, padding, and custom inner page elements."
    )
    theme = models.JSONField(
        help_text="Hex color theme specifications, font-family parameters, and custom brand visual states."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} (Synced on {self.updated_at.strftime('%Y-%m-%d %H:%M')})"


# =========================================================================
# APPROACH B: Single-Relation Polymorphic Schema
# One parent Page table and a unified Field Block table with a JSON payload dictionary.
# =========================================================================
class DynamicPage(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, help_text="The URL path ending (e.g. 'about-us')")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class PageFieldBlock(models.Model):
    ELEMENT_TYPES = [
        ('text', 'Rich Text Section / Header'),
        ('button', 'Call to Action Button'),
        ('image', 'Interactive Image Banner'),
        ('divider', 'Horizontal Line Divider'),
        ('spacer', 'Vertical Spacing block'),
    ]

    page = models.ForeignKey(DynamicPage, on_delete=models.CASCADE, related_name='blocks')
    block_type = models.CharField(max_length=20, choices=ELEMENT_TYPES, default='text')
    sort_order = models.PositiveIntegerField(default=0, help_text="Sequence order of the block on the page")
    data = models.JSONField(
        default=dict,
        help_text="Custom key-value configurations (e.g. {'content': 'Hello World', 'font_size': '24px'})"
    )

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return f"{self.page.title} - {self.get_block_type_display()} [Order #{self.sort_order}]"


# =========================================================================
# APPROACH C: STRICT RELATIONAL MULTI-MODEL CMS SCHEMA (Wordpress Style)
# To fulfill strict multi-model schemas, we split different page element/field 
# types into separate, concrete SQL tables. Each page contains a distinct number
# of fields, and the printer queries each model relation to render in sequence.
# =========================================================================
class CMSPage(models.Model):
    """
    Represents an independent page layout (e.g., Homepage, Services, Menu).
    """
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, help_text="The unique slug URL path (e.g., 'home-page', 'bistro-menu')")
    description = models.TextField(blank=True, help_text="SEO page excerpt metadata")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "CMS Page"
        verbose_name_plural = "CMS Pages"

    def __str__(self):
        return f"Page: {self.title} (/{self.slug})"


class PageTextBlock(models.Model):
    """
    Model 1: Custom Text and Typography Fields
    A page can contain 0 to many independent text blocks (headers, taglines, quotes).
    """
    page = models.ForeignKey(CMSPage, on_delete=models.CASCADE, related_name='text_blocks')
    content = models.TextField(help_text="The rich text content body")
    font_size = models.CharField(max_length=20, default="16px", help_text="Typography size (e.g., '32px', '14px')")
    font_weight = models.CharField(max_length=10, default="400", help_text="Font weight weight (e.g., '700', '400')")
    text_align = models.CharField(max_length=15, default="left", help_text="Alignment options (left/center/right)")
    color = models.CharField(max_length=30, default="#0F172A", help_text="CSS hex color code")
    sort_order = models.PositiveIntegerField(default=0, help_text="Ascending render sequence index")

    class Meta:
        ordering = ['sort_order']
        verbose_name = "Page Text Block"

    def __str__(self):
        excerpt = self.content[:35] + "..." if len(self.content) > 35 else self.content
        return f"{self.page.title} - [Text] {excerpt}"


class PageImageBlock(models.Model):
    """
    Model 2: Gallery and Graphic Slots
    A page can contain multiple image components with individual borders and alt logs.
    """
    page = models.ForeignKey(CMSPage, on_delete=models.CASCADE, related_name='image_blocks')
    image_url = models.URLField(max_length=500, help_text="URL direct source of the graphic")
    alt_text = models.CharField(max_length=255, blank=True, help_text="Accessibility alt banner tag")
    border_radius = models.CharField(max_length=20, default="8px", help_text="Corner curves (e.g., '12px', '0px')")
    sort_order = models.PositiveIntegerField(default=0, help_text="Ascending render sequence index")

    class Meta:
        ordering = ['sort_order']
        verbose_name = "Page Image Block"

    def __str__(self):
        return f"{self.page.title} - [Image] {self.alt_text or self.image_url[:40]}"


class PageButtonAction(models.Model):
    """
    Model 3: Interactive Conversion Buttons
    A page can contain Call-To-Action segments with custom links and button outlines.
    """
    page = models.ForeignKey(CMSPage, on_delete=models.CASCADE, related_name='button_blocks')
    label = models.CharField(max_length=100, default="Contact Us", help_text="Text content written inside the button")
    destination_url = models.CharField(max_length=255, default="#", help_text="Anchored navigation page or external URL link")
    bg_color = models.CharField(max_length=30, default="#4F46E5", help_text="Hex code of the button background")
    text_color = models.CharField(max_length=30, default="#FFFFFF")
    font_size = models.CharField(max_length=20, default="14px")
    sort_order = models.PositiveIntegerField(default=0, help_text="Ascending render sequence index")

    class Meta:
        ordering = ['sort_order']
        verbose_name = "Page Button Block"

    def __str__(self):
        return f"{self.page.title} - [Button] {self.label} -> {self.destination_url}"
