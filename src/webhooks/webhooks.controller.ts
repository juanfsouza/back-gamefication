import { Controller, Post, Body, Logger, UsePipes } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookSchema, CreateWebhookDto } from './dto/create-webhook.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('newsletter-opened')
  @UsePipes(new ZodValidationPipe(CreateWebhookSchema))
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
