import { Body, Controller, Post, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service'; 
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { ReportDto } from './dto/report.dto';
import { Serialize } from '../intereptors/serialize.interceptor';
import { ApprovedReportDto } from './dto/approve-report.dto';
import { AdminGuard } from '../auth/admin.guard';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService){}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User ) {
        return this.reportsService.create(body, user)
    }


    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApprovedReportDto) {
        return this.reportsService.changeApproval(id, body.approved )
    }

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query)

    }

}
