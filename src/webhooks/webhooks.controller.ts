import { Controller, Post, Body, Logger } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('newsletter-opened')
  async handleNewsletterOpened(@Body() createWebhookDto: CreateWebhookDto) {
    this.logger.log(`📩 Recebendo webhook: ${JSON.stringify(createWebhookDto)}`);

    try {
      await this.webhooksService.handleNewsletterOpened(createWebhookDto);
      return { message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error(`❌ Erro ao processar webhook: ${error.message}`);
      return { error: 'Failed to process webhook' };
    }
  }
}
