#!/usr/bin/perl
use strict;
use warnings;

use Template;
use File::Spec;
use File::Basename qw/dirname/;
use MIME::Type::FileName;

my $app = sub
{
  my $env = shift;

  my $request_uri = $env->{REQUEST_URI} || "index.html";

  my $basedir = dirname( __FILE__ ) . "/";
  my @dirs = File::Spec->splitdir( $request_uri );
  my $request_file = pop @dirs;

  while (@dirs)
  {
    last
      if -e $basedir . File::Spec->catfile( @dirs, $request_file . ".tt2");
    shift @dirs;
  }
  
  $request_uri = File::Spec->catfile(@dirs, $request_file);
  my $file = $basedir . "/" . $request_uri . ".tt2";
  my $vars = {};

  if (!-e $file)
  {
    warn "!-e " . $file;
    return [
      404,
      [ 'Content-Type' => 'text/html' ],
      [ '' ]
    ];
  }

  my $template = Template->new(
    EVAL_PERL    => 1,
    ABSOLUTE     => 1,
    INCLUDE_PATH => [
      $basedir . dirname($request_uri),
      $basedir,
    ],
  );

  my $output = '';
  my $success = $template->process( $file, $vars, \$output );

  if ($success)
  {
    return [
      '200 OK GO',
      [ 'Content-Type' => MIME::Type::FileName::guess($request_uri) ],
      [ $output ]
    ];
  }
  else
  {
    warn $template->error;
    return [
      '404 Nope, because, turkey',
      [ 'Content-Type' => 'text/html' ],
      [ '' ]
    ];
  }
};
