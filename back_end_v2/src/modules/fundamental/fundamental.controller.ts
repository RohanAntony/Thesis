import { Controller } from '@nestjs/common';
import { FundamentalService } from './fundamental.service';

@Controller('fundamental')
export class FundamentalController {
  constructor(private readonly fundamentalService: FundamentalService) {}

  // Get for a symbol

  // Set for a symbol
}
